const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function testGsap() {
  const port = 9718;
  const proc = spawn(edgePath, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    '--remote-debugging-port=' + port, '--user-data-dir=C:\\Users\\FKode solutiona\\.gemini\\antigravity-ide\\brain\\7ebc22a0-1f85-4c26-9f4e-4980e84d3ce2\\scratch\\edge-test-18',
    '--window-size=1440,1000', 'http://localhost:5173/about/founder'
  ]);
  await new Promise(r => setTimeout(r, 2000));
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
  await send('Runtime.enable');
  await send('Page.enable');

  const errors = [];
  ws.addEventListener('message', e => {
    const d = JSON.parse(e.data);
    if (d.method === 'Runtime.exceptionThrown') {
      errors.push(d.params.exceptionDetails);
    }
  });

  // Navigate directly to make sure
  await send('Page.navigate', { url: 'http://localhost:5173/about/founder' });
  await new Promise(r => setTimeout(r, 2000));

  const initialCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const v = document.querySelector('.sports-video-feature');
      const p = document.querySelector('.sports-photo-feature');
      return {
        vStyle: v?.getAttribute('style'),
        pStyle: p?.getAttribute('style')
      };
    })()`,
    returnByValue: true
  });
  console.log('INITIAL CHECK:', initialCheck.result.value);

  // Trigger scroll to sportsZone and wait 4 seconds
  await send('Runtime.evaluate', {
    expression: `(() => {
      const sportsZone = document.querySelector('.founder-sports-zone');
      sportsZone.scrollIntoView();
      window.dispatchEvent(new Event('scroll'));
    })()`
  });
  await new Promise(r => setTimeout(r, 4000));

  const afterCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const v = document.querySelector('.sports-video-feature');
      const p = document.querySelector('.sports-photo-feature');
      return {
        vStyle: v?.getAttribute('style'),
        vOp: v ? window.getComputedStyle(v).opacity : null,
        pStyle: p?.getAttribute('style'),
        pOp: p ? window.getComputedStyle(p).opacity : null
      };
    })()`,
    returnByValue: true
  });
  console.log('AFTER 4S CHECK:', afterCheck.result.value);
  console.log('EXCEPTIONS:', errors);

  ws.close();
  proc.kill();
}
testGsap();
