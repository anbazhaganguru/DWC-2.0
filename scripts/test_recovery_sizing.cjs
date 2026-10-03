const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = path.resolve(__dirname, '../public/audit/test_scratch');
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

async function testViewport(width) {
  const port = 9650 + Math.floor(Math.random() * 20);
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${path.join(scratchDir, 'edge-profile-size-' + width)}`,
    `--window-size=${width},900`,
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));

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
    const callbacks = new Map();
    let onLoadFired = null;

    ws.addEventListener('message', evt => {
      const msg = JSON.parse(evt.data);
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg.result);
        callbacks.delete(msg.id);
      }
      if (msg.method === 'Page.loadEventFired' && onLoadFired) {
        onLoadFired();
      }
    });

    function send(method, params = {}) {
      return new Promise(res => {
        const curId = id++;
        callbacks.set(curId, res);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width < 768
    });

    const loadPromise = new Promise(r => onLoadFired = r);
    await send('Page.navigate', { url: 'http://localhost:5173/' });
    await loadPromise;
    await new Promise(r => setTimeout(r, 2500));

    const metrics = await send('Runtime.evaluate', {
      expression: `(() => {
        const card = document.querySelector('.recovery-card');
        const media = document.querySelector('.recovery-card__media');
        const track = document.querySelector('.recovery-carousel-track');
        const cards = Array.from(document.querySelectorAll('.recovery-card'));

        const cardWidth = card?.offsetWidth;
        const cardHeight = card?.offsetHeight;
        const mediaHeight = media?.offsetHeight;
        const trackGap = track ? window.getComputedStyle(track).gap : null;

        // Check if multiple cards fit on screen
        const viewportWidth = window.innerWidth;
        const visibleCardsApprox = viewportWidth / (cardWidth + parseInt(trackGap || 20));

        // Measure distance between card 0 and card 6 (one loop cycle)
        const setWidth = cards.length >= 7 ? cards[6].offsetLeft - cards[0].offsetLeft : 0;

        return {
          viewportWidth,
          cardWidth,
          cardHeight,
          mediaHeight,
          trackGap,
          visibleCardsApprox: visibleCardsApprox.toFixed(2),
          setWidth,
          totalCardsRendered: cards.length
        };
      })()`,
      returnByValue: true
    });

    console.log(`Viewport ${width}px results:`, JSON.stringify(metrics.result.value, null, 2));

    ws.close();
    proc.kill();
  } catch (err) {
    console.error(`Error at viewport ${width}:`, err);
    proc.kill();
  }
}

async function run() {
  await testViewport(1920);
  await testViewport(1440);
  await testViewport(390);
  process.exit(0);
}

run();
