const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDir = path.join(os.tmpdir(), 'edge-quick-' + Date.now());
fs.mkdirSync(userDir, { recursive: true });

async function run() {
  const port = 9760;
  console.log('Spawning edge...');
  const proc = spawn(edgePath, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    '--remote-debugging-port=' + port, '--user-data-dir=' + userDir,
    '--window-size=1440,900', 'http://localhost:4173/about/founder'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const list = await new Promise(res => http.get('http://127.0.0.1:' + port + '/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));

  const ws = new globalThis.WebSocket(list[0].webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (m, p = {}) => new Promise(res => {
    const cur = id++;
    const h = (e) => { const msg = JSON.parse(e.data); if (msg.id === cur) { ws.removeEventListener('message', h); res(msg.result); } };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: cur, method: m, params: p }));
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await new Promise(r => setTimeout(r, 1000));

  // Take screenshot at current scroll
  let shot = await send('Page.captureScreenshot');
  fs.writeFileSync('scratch_screenshots/test_top.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved test_top.png');

  // Scroll to sports
  await send('Runtime.evaluate', { expression: 'document.querySelector(".founder-sports-section").scrollIntoView()' });
  await new Promise(r => setTimeout(r, 800));
  shot = await send('Page.captureScreenshot');
  fs.writeFileSync('scratch_screenshots/test_sports.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved test_sports.png');

  // Scroll down 400px
  await send('Runtime.evaluate', { expression: 'window.scrollBy(0, 400)' });
  await new Promise(r => setTimeout(r, 800));
  shot = await send('Page.captureScreenshot');
  fs.writeFileSync('scratch_screenshots/test_sports_mid.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved test_sports_mid.png');

  // Scroll down 400px
  await send('Runtime.evaluate', { expression: 'window.scrollBy(0, 400)' });
  await new Promise(r => setTimeout(r, 800));
  shot = await send('Page.captureScreenshot');
  fs.writeFileSync('scratch_screenshots/test_sports_end.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved test_sports_end.png');

  ws.close();
  proc.kill();
  console.log('Done!');
}
run();
