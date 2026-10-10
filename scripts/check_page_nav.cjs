const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function check() {
  const port = 9716;
  const proc = spawn(edgePath, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    '--remote-debugging-port=' + port, '--user-data-dir=C:\\Users\\FKode solutiona\\.gemini\\antigravity-ide\\brain\\7ebc22a0-1f85-4c26-9f4e-4980e84d3ce2\\scratch\\edge-test-16',
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
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Page.navigate', { url: 'http://localhost:5173/about/founder' });
  await new Promise(r => setTimeout(r, 2500));

  const pageInfo = await send('Runtime.evaluate', {
    expression: '(() => ({ url: window.location.href, title: document.title, hasSportsVideo: !!document.querySelector(".sports-video-feature") }))()',
    returnByValue: true
  });
  console.log('Page info:', pageInfo.result.value);

  ws.close();
  proc.kill();
}
check();
