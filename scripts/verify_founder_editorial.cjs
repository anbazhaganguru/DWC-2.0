const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = path.resolve(__dirname, '../public/audit/test_scratch');
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

async function runAudit() {
  const port = 9588;
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${path.join(scratchDir, 'edge-profile-founder-audit')}`,
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
        const handler = (evt) => {
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

    const consoleErrors = [];
    ws.addEventListener('message', evt => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Console.messageAdded' && msg.params.message.level === 'error') {
        consoleErrors.push(msg.params.message.text);
      }
    });

    await send('Runtime.enable');
    await send('Page.enable');
    await send('Console.enable');

    async function evaluate(expression) {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true });
      return res?.result?.value;
    }

    console.log('--- 1. AUDITING HOMEPAGE ABOUT SECTION ---');
    await evaluate(`window.location.href = 'http://localhost:5173/'`);
    await new Promise(r => setTimeout(r, 2000));

    const homeAboutImg = await evaluate(`(() => {
      const img = document.querySelector('#about .founder-image');
      const teaser = document.querySelector('.about-teaser-zone');
      return {
        hasTeaser: !!teaser,
        src: img ? img.getAttribute('src') : null,
        alt: img ? img.getAttribute('alt') : null
      };
    })()`);
    console.log('Homepage About:', homeAboutImg);

    console.log('\n--- 2. AUDITING FOUNDER PAGE (/about/founder) AT 1440PX ---');
    await evaluate(`window.location.href = 'http://localhost:5173/about/founder'`);
    await new Promise(r => setTimeout(r, 2500));

    const founderData = await evaluate(`(() => {
      const heroImg = document.querySelector('.founder-hero-section .founder-image');
      const sportsPhotoB = document.querySelector('.sports-media-card--photo img');
      const sportsVideo01 = document.querySelector('.sports-media-card--video');
      const recordsPhotoA = document.querySelector('.records-modular-card--photo img');
      const recImgs = document.querySelectorAll('.recognition-modular-card img');
      const recognitionPhotoC = recImgs[0] || null;
      const pressPhotoD = recImgs[1] || null;
      const recordsVideo02 = document.querySelector('.records-modular-card--video');
      const igLink = document.querySelector('.founder-instagram-link');
      const recordsGrid = document.querySelectorAll('.record-compact-card');
      const basketballCard = document.querySelector('.sports-compact-card--basketball');
      const netballCard = document.querySelector('.sports-compact-card--netball');
      const overflow = document.documentElement.scrollWidth > window.innerWidth;

      return {
        heroImg: heroImg ? heroImg.getAttribute('src') : null,
        hasBasketballCard: !!basketballCard,
        hasNetballCard: !!netballCard,
        sportsPhotoB: sportsPhotoB ? { src: sportsPhotoB.getAttribute('src'), alt: sportsPhotoB.getAttribute('alt') } : null,
        hasSportsVideo01: !!sportsVideo01,
        recordsCount: recordsGrid.length,
        recordsPhotoA: recordsPhotoA ? { src: recordsPhotoA.getAttribute('src'), alt: recordsPhotoA.getAttribute('alt') } : null,
        recognitionPhotoC: recognitionPhotoC ? { src: recognitionPhotoC.getAttribute('src'), alt: recognitionPhotoC.getAttribute('alt') } : null,
        pressPhotoD: pressPhotoD ? { src: pressPhotoD.getAttribute('src'), alt: pressPhotoD.getAttribute('alt') } : null,
        hasRecordsVideo02: !!recordsVideo02,
        igLink: igLink ? {
          href: igLink.getAttribute('href'),
          target: igLink.getAttribute('target'),
          rel: igLink.getAttribute('rel'),
          text: igLink.innerText.trim().replace(/\\s+/g, ' ')
        } : null,
        overflow,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      };
    })()`);
    console.log('Founder Page Audit Results (1440px):', JSON.stringify(founderData, null, 2));

    console.log('\n--- 3. TESTING INTERACTIVE VIDEO MODALS ---');
    // Scroll down to Sports
    await evaluate(`window.scrollTo(0, 1200)`);
    await new Promise(r => setTimeout(r, 300));
    const preScrollPos = await evaluate(`window.scrollY`);

    // Click Video 01
    await evaluate(`document.querySelector('.sports-media-card--video').click()`);
    await new Promise(r => setTimeout(r, 400));

    const modal1 = await evaluate(`(() => {
      const modal = document.querySelector('.founder-video-modal-backdrop');
      const title = document.querySelector('.founder-video-modal__title');
      return {
        isOpen: !!modal,
        title: title ? title.innerText : null,
        bodyOverflow: document.body.style.overflow
      };
    })()`);
    console.log('Video 01 Modal Opened:', modal1);

    // ESC close
    await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', windowsVirtualKeyCode: 27 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', windowsVirtualKeyCode: 27 });
    await new Promise(r => setTimeout(r, 400));

    const modal1Closed = await evaluate(`(() => {
      return {
        isOpen: !!document.querySelector('.founder-video-modal-backdrop'),
        bodyOverflow: document.body.style.overflow,
        scrollY: window.scrollY
      };
    })()`);
    console.log('Video 01 Modal Closed via ESC:', modal1Closed);
    console.log('Scroll position accurately restored?', Math.abs(modal1Closed.scrollY - preScrollPos) < 5);

    // Click Video 02
    await evaluate(`document.querySelector('.records-modular-card--video').click()`);
    await new Promise(r => setTimeout(r, 400));

    const modal2 = await evaluate(`(() => {
      const modal = document.querySelector('.founder-video-modal-backdrop');
      const title = document.querySelector('.founder-video-modal__title');
      return {
        isOpen: !!modal,
        title: title ? title.innerText : null
      };
    })()`);
    console.log('Video 02 Modal Opened:', modal2);

    // Close button click
    await evaluate(`document.querySelector('.founder-video-modal__close-btn').click()`);
    await new Promise(r => setTimeout(r, 400));

    const modal2Closed = await evaluate(`!document.querySelector('.founder-video-modal-backdrop')`);
    console.log('Video 02 Modal Closed via Close Button?', modal2Closed);

    console.log('\n--- 4. AUDITING FOUNDER PAGE AT MOBILE (390PX) ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 1000));

    const mobileData = await evaluate(`(() => {
      const overflow = document.documentElement.scrollWidth > window.innerWidth;
      return {
        overflow,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      };
    })()`);
    console.log('Founder Page Mobile (390px):', mobileData);

    console.log('\n--- 5. CONSOLE ERRORS ---');
    console.log('Any Console Errors?', consoleErrors.length > 0 ? consoleErrors : 'None (0 errors)');

    ws.close();
  } catch (err) {
    console.error('Audit failed:', err);
  } finally {
    proc.kill();
  }
}

runAudit();
