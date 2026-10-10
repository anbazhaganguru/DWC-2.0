const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDir = path.join(os.tmpdir(), 'edge-inspect-' + Date.now());

async function check() {
  const port = 9775;
  const proc = spawn(edgePath, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    '--remote-debugging-port=' + port, '--user-data-dir=' + userDir,
    '--window-size=1440,900', 'http://localhost:4173/about/founder'
  ]);

  await new Promise(r => setTimeout(r, 2500));
  const list = await new Promise(res => http.get('http://127.0.0.1:' + port + '/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));

  const pageTarget = list.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension')) || list[0];
  const ws = new globalThis.WebSocket(pageTarget.webSocketDebuggerUrl);
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

  let pageCheck = await send('Runtime.evaluate', {
    expression: `({
      href: window.location.href,
      title: document.title,
      bodyText: document.body.innerText.slice(0, 200),
      sportsSection: !!document.querySelector('.founder-sports-section'),
      sportsZone: !!document.querySelector('.founder-sports-zone'),
      videoCount: document.querySelectorAll('.sports-video-feature').length,
      photoCount: document.querySelectorAll('.sports-photo-feature').length
    })`,
    returnByValue: true
  });
  console.log('PAGE CHECK:', pageCheck.result.value);
  let res = await send('Runtime.evaluate', {
    expression: `(() => {
      const v = document.querySelector('.sports-video-feature');
      const p = document.querySelector('.sports-photo-feature');
      const csV = v ? window.getComputedStyle(v) : null;
      const csP = p ? window.getComputedStyle(p) : null;
      return {
        video: v ? {
          inlineStyle: v.getAttribute('style'),
          opacity: csV.opacity,
          visibility: csV.visibility,
          transform: csV.transform,
          rect: v.getBoundingClientRect()
        } : null,
        photo: p ? {
          inlineStyle: p.getAttribute('style'),
          opacity: csP.opacity,
          visibility: csP.visibility,
          transform: csP.transform,
          rect: p.getBoundingClientRect()
        } : null
      };
    })()`,
    returnByValue: true
  });
  console.log('BEFORE SCROLL:', JSON.stringify(res.result.value, null, 2));

  // Scroll down to 1800
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, 1800)` });
  await new Promise(r => setTimeout(r, 1000));

  res = await send('Runtime.evaluate', {
    expression: `(() => {
      const v = document.querySelector('.sports-video-feature');
      const csV = v ? window.getComputedStyle(v) : null;
      return {
        video: v ? {
          inlineStyle: v.getAttribute('style'),
          opacity: csV.opacity,
          visibility: csV.visibility,
          transform: csV.transform,
          rect: v.getBoundingClientRect()
        } : null
      };
    })()`,
    returnByValue: true
  });
  console.log('AFTER SCROLL TO 1800:', JSON.stringify(res.result.value, null, 2));

  ws.close();
  proc.kill();
}

check();
