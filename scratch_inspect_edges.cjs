const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = path.resolve(__dirname, 'public/audit/test_scratch');
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

async function inspect(width) {
  const port = 9660 + Math.floor(Math.random() * 20);
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${path.join(scratchDir, 'edge-profile-edges-' + width)}`,
    `--window-size=${width},1000`,
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
      height: 1000,
      deviceScaleFactor: 1,
      mobile: width < 768
    });

    const loadPromise = new Promise(r => onLoadFired = r);
    await send('Page.navigate', { url: 'http://localhost:5173/' });
    await loadPromise;
    await new Promise(r => setTimeout(r, 2500));

    // Scroll to #therapy and get detailed layout
    const info = await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('#therapy');
        const dir = document.querySelector('.therapy-directory-header');
        const grid = document.querySelector('.therapy-grid');
        const cards = Array.from(document.querySelectorAll('.therapy-card'));
        
        if (dir) dir.scrollIntoView({ block: 'start' });
        
        return {
          dirBorderBottom: dir ? window.getComputedStyle(dir).borderBottom : null,
          gridBorderTop: grid ? window.getComputedStyle(grid).borderTop : null,
          gridGap: grid ? window.getComputedStyle(grid).gap : null,
          gridBg: grid ? window.getComputedStyle(grid).backgroundColor : null,
          cards: cards.map(c => {
            const cs = window.getComputedStyle(c);
            const header = c.querySelector('.therapy-card__header');
            const hs = header ? window.getComputedStyle(header) : null;
            const numTag = c.querySelector('.therapy-card__number-tag');
            const nts = numTag ? window.getComputedStyle(numTag) : null;
            const accentLine = c.querySelector('.therapy-card-number-line');
            const als = accentLine ? window.getComputedStyle(accentLine) : null;
            return {
              title: c.querySelector('.therapy-card__title')?.innerText,
              cardBorderTop: cs.borderTop,
              cardBorderBlockStart: cs.borderBlockStart,
              cardBoxShadow: cs.boxShadow,
              cardBg: cs.backgroundColor,
              cardBgImg: cs.backgroundImage,
              headerBorderTop: hs ? hs.borderTop : null,
              numTagBorderTop: nts ? nts.borderTop : null,
              accentLineWidth: als ? als.width : null,
              accentLineBg: als ? als.backgroundColor : null,
              accentLineDisplay: als ? als.display : null
            };
          })
        };
      })()`,
      returnByValue: true
    });

    console.log(`Viewport ${width} info:`, JSON.stringify(info.result.value, null, 2));

    await new Promise(r => setTimeout(r, 500));

    // Capture screenshot of viewport after scrolling to therapy
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const dest = path.resolve(__dirname, 'public/audit', `therapy_inspect_${width}.png`);
    fs.writeFileSync(dest, Buffer.from(shot.data, 'base64'));
    console.log(`Saved screenshot ${dest}`);

    ws.close();
    proc.kill();
  } catch (err) {
    console.error(`Error in inspect ${width}:`, err);
    proc.kill();
  }
}

async function run() {
  await inspect(1440);
  await inspect(390);
  process.exit(0);
}

run();
