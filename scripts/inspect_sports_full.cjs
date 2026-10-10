const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDir = path.join(os.tmpdir(), 'edge-sports-' + Date.now());
fs.mkdirSync(userDir, { recursive: true });

async function run() {
  const port = 9731;
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-debugging-port=' + port,
    '--user-data-dir=' + userDir,
    '--window-size=1440,1200',
    'http://localhost:4173/about/founder'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const list = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:' + port + '/json', res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const ws = new globalThis.WebSocket(list[0].webSocketDebuggerUrl);
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

  await send('Page.enable');
  await send('Runtime.enable');
  await new Promise(r => setTimeout(r, 1000));

  // Scroll through to ensure ScrollTrigger fires
  await send('Runtime.evaluate', {
    expression: `(async () => {
      for (let i = 0; i < 20; i++) {
        window.scrollBy(0, 150);
        await new Promise(r => setTimeout(r, 40));
      }
    })()`,
    awaitPromise: true
  });
  await new Promise(r => setTimeout(r, 1000));

  // Get bounding rects of everything inside sports
  const info = await send('Runtime.evaluate', {
    expression: `(() => {
      const sports = document.querySelector('.founder-sports-section');
      const nodes = sports.querySelectorAll('*');
      return Array.from(nodes).map(n => ({
        tag: n.tagName,
        cls: n.className,
        rect: n.getBoundingClientRect(),
        opacity: window.getComputedStyle(n).opacity,
        display: window.getComputedStyle(n).display,
        visibility: window.getComputedStyle(n).visibility
      })).filter(x => x.cls && typeof x.cls === 'string' && x.cls.includes('sports'));
    })()`,
    returnByValue: true
  });

  console.log('SPORTS NODES:', JSON.stringify(info.result.value, null, 2));

  // Scroll so sports section is in view
  await send('Runtime.evaluate', {
    expression: `document.querySelector('.founder-sports-section').scrollIntoView({ behavior: 'instant', block: 'start' })`
  });
  await new Promise(r => setTimeout(r, 600));

  // Capture full screenshot of sports element
  const clip = await send('Runtime.evaluate', {
    expression: `(() => {
      const r = document.querySelector('.founder-sports-section').getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, scale: 1 };
    })()`,
    returnByValue: true
  });

  const shot = await send('Page.captureScreenshot', { clip: clip.result.value });
  fs.writeFileSync('scratch_screenshots/full_sports_element.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved scratch_screenshots/full_sports_element.png');

  ws.close();
  proc.kill();
}
run();
