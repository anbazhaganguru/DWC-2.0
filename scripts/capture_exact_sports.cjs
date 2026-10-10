const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDir = path.join(os.tmpdir(), 'edge-sports-exact-' + Date.now());
fs.mkdirSync(userDir, { recursive: true });

async function run() {
  const port = 9742;
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-debugging-port=' + port,
    '--user-data-dir=' + userDir,
    '--window-size=1440,900',
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

  // Scroll through to trigger all ScrollTriggers
  await send('Runtime.evaluate', {
    expression: `(async () => {
      for (let pos = 0; pos <= 2500; pos += 200) {
        window.scrollTo(0, pos);
        await new Promise(r => setTimeout(r, 50));
      }
    })()`,
    awaitPromise: true
  });
  await new Promise(r => setTimeout(r, 1000));

  // Scroll to exact positions and capture screenshots
  const sportsTop = await send('Runtime.evaluate', {
    expression: `document.querySelector('.founder-sports-section').offsetTop`,
    returnByValue: true
  });
  const topY = sportsTop.result.value;
  console.log('Sports top Y:', topY);

  windowPositions = [
    { name: 'sports_view_1_top.png', y: topY },
    { name: 'sports_view_2_mid.png', y: topY + 400 },
    { name: 'sports_view_3_bottom.png', y: topY + 800 }
  ];

  for (const pos of windowPositions) {
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${pos.y})` });
    await new Promise(r => setTimeout(r, 300));
    const shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join('scratch_screenshots', pos.name), Buffer.from(shot.data, 'base64'));
    console.log('Saved', pos.name);
  }

  ws.close();
  proc.kill();
}
run();
