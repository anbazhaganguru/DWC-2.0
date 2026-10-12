const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDir = path.join(os.tmpdir(), 'edge-inspect-' + Date.now());
fs.mkdirSync(userDir, { recursive: true });

async function run() {
  const port = 9888;
  const proc = spawn(edgePath, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    '--remote-debugging-port=' + port, '--user-data-dir=' + userDir,
    '--window-size=1440,1080', 'http://localhost:5173/DWC-2.0/'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const list = await new Promise(res => http.get('http://127.0.0.1:' + port + '/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));

  const page = list.find(p => p.type === 'page') || list[0];
  const ws = new globalThis.WebSocket(page.webSocketDebuggerUrl);
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

  // Scroll to #reviews
  await send('Runtime.evaluate', {
    expression: `
      const el = document.querySelector('#reviews');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });

  await new Promise(r => setTimeout(r, 4500));

  const info = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const c = document.querySelector('.zyff-google-reviews');
        const root = c?.querySelector('[data-zyff-root]');
        const shadow = root?.shadowRoot;
        return {
          containerTag: c?.outerHTML.slice(0, 300),
          rootTag: root?.outerHTML.slice(0, 300),
          hasShadow: !!shadow,
          shadowHTML: shadow ? shadow.innerHTML : null,
          hasInjectedTheme: !!shadow?.querySelector('[data-dwc-theme-injected]')
        };
      })()
    `,
    returnByValue: true
  });

  fs.writeFileSync('scratch/zyff_dom_dump.json', JSON.stringify(info.result.value, null, 2));
  console.log('DOM dump saved to scratch/zyff_dom_dump.json');
  console.log('hasInjectedTheme:', info.result.value?.hasInjectedTheme);

  ws.close();
  proc.kill();
}

run().catch(console.error);
