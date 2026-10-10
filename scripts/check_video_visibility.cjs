const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = path.resolve(__dirname, '../public/audit/founder_inspect');

async function test() {
  const port = 9710;
  const userDir = path.join(scratchDir, 'edge-' + Date.now());
  const proc = spawn(edgePath, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    '--remote-debugging-port=' + port, '--user-data-dir=' + userDir,
    '--window-size=1440,1000', 'http://localhost:5173/about/founder'
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
  await send('Runtime.enable'); await send('Page.enable');

  // Check before and after scroll
  let infoBefore = await send('Runtime.evaluate', {
    expression: '(() => { const v = document.querySelector(".sports-video-feature"); return { opacity: window.getComputedStyle(v).opacity, visibility: window.getComputedStyle(v).visibility, display: window.getComputedStyle(v).display }; })()',
    returnByValue: true
  });
  console.log('Video element before scroll:', infoBefore.result.value);

  // Scroll to 1600
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 1600)' });
  await new Promise(r => setTimeout(r, 800));

  let infoAfter = await send('Runtime.evaluate', {
    expression: '(() => { const v = document.querySelector(".sports-video-feature"); return { opacity: window.getComputedStyle(v).opacity, visibility: window.getComputedStyle(v).visibility, display: window.getComputedStyle(v).display }; })()',
    returnByValue: true
  });
  console.log('Video element after scroll:', infoAfter.result.value);

  ws.close();
  proc.kill();
}
test();
