const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = path.resolve(__dirname, '../public/audit/test_scratch');
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

async function testRecovery() {
  const port = 9620;
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${path.join(scratchDir, 'edge-profile-recovery')}`,
    '--window-size=1440,900',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/json`, res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const pageTarget = list.find(t => t.type === 'page') || list[0];
    const ws = new globalThis.WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(method, params = {}) {
      return new Promise(res => {
        const curId = id++;
        const handler = evt => {
          const msg = JSON.parse(evt.data);
          if (msg.id === curId) {
            ws.removeEventListener('message', handler);
            res(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');

    await send('Page.navigate', { url: 'http://localhost:5173/' });
    await new Promise(r => setTimeout(r, 3000));

    const evalResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const section = document.querySelector('#recovery');
        if (!section) return { error: 'Section #recovery not found' };

        const headerTitle = section.querySelector('.recovery-header__title')?.textContent;
        const counter = section.querySelector('.recovery-header__counter')?.textContent;
        const cards = Array.from(section.querySelectorAll('.recovery-card')).map(c => ({
          title: c.querySelector('.recovery-card__title')?.textContent,
          badge: c.querySelector('.recovery-card__badge')?.textContent,
          benefitsCount: c.querySelectorAll('.recovery-card__benefit-item')?.length,
          imgSrc: c.querySelector('.recovery-card__img')?.getAttribute('src'),
          width: c.offsetWidth,
          height: c.offsetHeight
        }));

        const carousel = section.querySelector('.recovery-carousel');
        const trackbar = section.querySelector('.recovery-trackbar');
        const prevBtn = section.querySelector('.recovery-header__btn--prev');
        const nextBtn = section.querySelector('.recovery-header__btn--next');

        return {
          headerTitle,
          counter,
          cardsCount: cards.length,
          cardsSample: cards.slice(0, 3),
          carouselScrollWidth: carousel?.scrollWidth,
          carouselClientWidth: carousel?.clientWidth,
          prevDisabled: prevBtn?.disabled,
          nextDisabled: nextBtn?.disabled,
          hasTrackbar: !!trackbar
        };
      })()`,
      returnByValue: true
    });

    console.log('Recovery DOM Evaluation:', JSON.stringify(evalResult.result.value, null, 2));

    // Test clicking Next button
    await send('Runtime.evaluate', {
      expression: `(() => {
        const nextBtn = document.querySelector('.recovery-header__btn--next');
        if (nextBtn) {
          nextBtn.click();
          return { clicked: true };
        }
        return { clicked: false };
      })()`,
      returnByValue: true
    });

    await new Promise(r => setTimeout(r, 600));

    const afterScroll = await send('Runtime.evaluate', {
      expression: `(() => {
        const carousel = document.querySelector('.recovery-carousel');
        const counter = document.querySelector('.recovery-header__counter')?.textContent;
        const prevBtn = document.querySelector('.recovery-header__btn--prev');
        return {
          scrollLeft: carousel?.scrollLeft,
          counter,
          prevDisabled: prevBtn?.disabled
        };
      })()`,
      returnByValue: true
    });

    console.log('After Next Click:', JSON.stringify(afterScroll.result.value, null, 2));

    ws.close();
  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    proc.kill();
  }
}

testRecovery().catch(console.error);
