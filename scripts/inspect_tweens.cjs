const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDir = path.join(os.tmpdir(), 'edge-gsap-test2-' + Date.now());

async function check() {
  const port = Math.floor(9100 + Math.random() * 800);
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

  ws.addEventListener('message', e => {
    const d = JSON.parse(e.data);
    if (d.method === 'Runtime.consoleAPICalled') {
      console.log('CONSOLE:', d.params.args.map(a => a.value || a.description).join(' '));
    }
    if (d.method === 'Runtime.exceptionThrown') {
      console.error('EXCEPTION:', JSON.stringify(d.params.exceptionDetails));
    }
  });

  await new Promise(r => setTimeout(r, 1000));

  const result = await send('Runtime.evaluate', {
    expression: `(() => {
      const v = document.querySelector('.sports-video-feature');
      // What happens if we check GSAP animations on v?
      const tweens = window.gsap ? window.gsap.getTweensOf(v) : [];
      return {
        vStyle: v.getAttribute('style'),
        tweensCount: tweens.length,
        tweenDetails: tweens.map(tw => ({
          duration: tw.duration(),
          progress: tw.progress(),
          paused: tw.paused(),
          totalTime: tw.totalTime(),
          parentProgress: tw.parent ? tw.parent.progress() : null,
          parentTotalDuration: tw.parent ? tw.parent.totalDuration() : null
        }))
      };
    })()`,
    returnByValue: true
  });

  console.log('TWEEN DETAILS BEFORE SCROLL:', JSON.stringify(result.result.value, null, 2));

  // Now scroll to 1400 and check progress
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, 1400)` });
  await new Promise(r => setTimeout(r, 2500));

  const result2 = await send('Runtime.evaluate', {
    expression: `(() => {
      const v = document.querySelector('.sports-video-feature');
      const tweens = window.gsap ? window.gsap.getTweensOf(v) : [];
      return {
        vStyle: v.getAttribute('style'),
        vOpacity: window.getComputedStyle(v).opacity,
        tweensCount: tweens.length,
        tweenDetails: tweens.map(tw => ({
          duration: tw.duration(),
          progress: tw.progress(),
          paused: tw.paused(),
          totalTime: tw.totalTime(),
          parentProgress: tw.parent ? tw.parent.progress() : null
        }))
      };
    })()`,
    returnByValue: true
  });

  console.log('TWEEN DETAILS AFTER SCROLL:', JSON.stringify(result2.result.value, null, 2));

  ws.close();
  proc.kill();
}

check();
