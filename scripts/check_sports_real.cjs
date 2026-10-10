const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDir = path.join(os.tmpdir(), 'edge-test-' + Date.now());

async function run() {
  const port = 9812;
  const proc = spawn(edgePath, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    '--remote-debugging-port=' + port, '--user-data-dir=' + userDir,
    '--window-size=1440,1000', 'http://localhost:4173/about/founder'
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

  // Let's scroll through the page
  await send('Runtime.evaluate', {
    expression: `(async () => {
      for (let y = 0; y <= 3000; y += 100) {
        window.scrollTo(0, y);
        window.dispatchEvent(new Event('scroll'));
        await new Promise(r => setTimeout(r, 20));
      }
    })()`,
    awaitPromise: true
  });
  await new Promise(r => setTimeout(r, 1500));

  const sportsInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      const s = document.querySelector('.founder-sports-section');
      const v = document.querySelector('.sports-video-feature');
      const p = document.querySelector('.sports-photo-feature');
      const nb = document.querySelector('.sports-card--netball');
      const bb = document.querySelector('.sports-card--basketball');
      const facts = document.querySelector('.founder-sports__facts-col');
      const media = document.querySelector('.founder-sports__media-col');
      const grid = document.querySelector('.founder-sports__grid');
      return {
        sectionHeight: s?.offsetHeight,
        gridHeight: grid?.offsetHeight,
        factsHeight: facts?.offsetHeight,
        mediaHeight: media?.offsetHeight,
        bbHeight: bb?.offsetHeight,
        nbHeight: nb?.offsetHeight,
        photoHeight: p?.offsetHeight,
        videoHeight: v?.offsetHeight,
        videoOpacity: v ? window.getComputedStyle(v).opacity : null,
        videoDisplay: v ? window.getComputedStyle(v).display : null,
        videoRect: v?.getBoundingClientRect(),
        photoRect: p?.getBoundingClientRect(),
        factsRect: facts?.getBoundingClientRect(),
        mediaRect: media?.getBoundingClientRect()
      };
    })()`,
    returnByValue: true
  });
  console.log('SPORTS REAL INFO:', JSON.stringify(sportsInfo.result.value, null, 2));

  // Take screenshot of sports top
  await send('Runtime.evaluate', {
    expression: `document.querySelector('.founder-sports-section').scrollIntoView({ behavior: 'instant', block: 'start' });`
  });
  await new Promise(r => setTimeout(r, 600));
  const shot1 = await send('Page.captureScreenshot');
  fs.writeFileSync('scratch_screenshots/real_sports_view.png', Buffer.from(shot1.data, 'base64'));

  // Scroll down 450px to see bottom of sports
  await send('Runtime.evaluate', { expression: 'window.scrollBy(0, 450);' });
  await new Promise(r => setTimeout(r, 600));
  const shot2 = await send('Page.captureScreenshot');
  fs.writeFileSync('scratch_screenshots/real_sports_view_bottom.png', Buffer.from(shot2.data, 'base64'));

  ws.close();
  proc.kill();
}
run();
