const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDir = path.join(os.tmpdir(), 'edge-trail-' + Date.now());
fs.mkdirSync(userDir, { recursive: true });

async function run() {
  const port = 9755;
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

  // Step scroll down to bottom and then back to trigger GSAP
  for (let y = 0; y <= 5500; y += 300) {
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` });
    await new Promise(r => setTimeout(r, 40));
  }
  await new Promise(r => setTimeout(r, 1000));

  const steps = [
    { name: 'step_1_hero.png', y: 0 },
    { name: 'step_2_education.png', y: 700 },
    { name: 'step_3_sports_top.png', y: 1200 },
    { name: 'step_4_sports_bottom.png', y: 1750 },
    { name: 'step_5_records_top.png', y: 2300 },
    { name: 'step_6_records_press.png', y: 3500 },
    { name: 'step_7_wellness.png', y: 4400 },
    { name: 'step_8_vision.png', y: 5100 }
  ];

  for (const s of steps) {
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${s.y})` });
    await new Promise(r => setTimeout(r, 250));
    const shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join('scratch_screenshots', s.name), Buffer.from(shot.data, 'base64'));
    console.log('Saved', s.name);
  }

  ws.close();
  proc.kill();
}
run();
