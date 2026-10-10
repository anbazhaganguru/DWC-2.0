const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDir = path.join(os.tmpdir(), 'edge-test-sports-' + Date.now());

async function run() {
  const port = 9815;
  const proc = spawn(edgePath, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    '--remote-debugging-port=' + port, '--user-data-dir=' + userDir,
    '--window-size=1440,1000', 'http://localhost:4173/about/founder'
  ]);
  await new Promise(r => setTimeout(r, 2500));
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
  await new Promise(r => setTimeout(r, 1500));

  // Let's scroll past the sports section
  await send('Runtime.evaluate', {
    expression: `(async () => {
      for (let y = 0; y <= 2500; y += 150) {
        window.scrollTo(0, y);
        window.dispatchEvent(new Event('scroll'));
        await new Promise(r => setTimeout(r, 50));
      }
    })()`,
    awaitPromise: true
  });
  await new Promise(r => setTimeout(r, 2000));

  const info = await send('Runtime.evaluate', {
    expression: `(() => {
      const v = document.querySelector('.sports-video-feature');
      const p = document.querySelector('.sports-photo-feature');
      const nb = document.querySelector('.sports-card--netball');
      return {
        video: v ? {
          style: v.getAttribute('style'),
          opacity: window.getComputedStyle(v).opacity,
          rect: v.getBoundingClientRect()
        } : null,
        photo: p ? {
          style: p.getAttribute('style'),
          opacity: window.getComputedStyle(p).opacity,
          rect: p.getBoundingClientRect()
        } : null,
        netball: nb ? {
          rect: nb.getBoundingClientRect()
        } : null
      };
    })()`,
    returnByValue: true
  });
  console.log('INFO AFTER SCROLL:', JSON.stringify(info.result.value, null, 2));

  // Scroll to sports section and take screenshot
  await send('Runtime.evaluate', {
    expression: `window.scrollTo(0, 1200)`
  });
  await new Promise(r => setTimeout(r, 500));
  const shot1 = await send('Page.captureScreenshot');
  fs.writeFileSync('scratch_screenshots/test_sports_at_1200.png', Buffer.from(shot1.data, 'base64'));

  await send('Runtime.evaluate', {
    expression: `window.scrollTo(0, 1600)`
  });
  await new Promise(r => setTimeout(r, 500));
  const shot2 = await send('Page.captureScreenshot');
  fs.writeFileSync('scratch_screenshots/test_sports_at_1600.png', Buffer.from(shot2.data, 'base64'));

  ws.close();
  proc.kill();
}
run();
