const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDir = path.join(os.tmpdir(), 'edge-gsap-debug-' + Date.now());

async function check() {
  const port = 9789;
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

  // Let's inspect ScrollTrigger and the sports elements
  const info = await send('Runtime.evaluate', {
    expression: `(() => {
      const sportsZone = document.querySelector('.founder-sports-zone');
      const header = sportsZone.querySelector('.founder-sports__header');
      const sportsCards = Array.from(sportsZone.querySelectorAll('.sports-card'));
      const mediaCards = Array.from(sportsZone.querySelectorAll('.sports-photo-feature, .sports-video-feature'));

      // Check all ScrollTrigger instances
      const triggers = window.ScrollTrigger ? window.ScrollTrigger.getAll().map(st => ({
        trigger: st.trigger?.className,
        start: st.start,
        end: st.end,
        progress: st.progress,
        vars: st.vars
      })) : [];

      return {
        header: header?.className,
        sportsCards: sportsCards.map(c => ({ cls: c.className, style: c.getAttribute('style') })),
        mediaCards: mediaCards.map(c => ({ cls: c.className, style: c.getAttribute('style') })),
        triggers
      };
    })()`,
    returnByValue: true
  });

  console.log('INITIAL STATE:', JSON.stringify(info.result.value, null, 2));

  // Scroll so sportsZone triggers
  await send('Runtime.evaluate', {
    expression: `(() => {
      window.scrollTo(0, 1400);
    })()`
  });
  await new Promise(r => setTimeout(r, 2000));

  const after = await send('Runtime.evaluate', {
    expression: `(() => {
      const sportsZone = document.querySelector('.founder-sports-zone');
      const mediaCards = Array.from(sportsZone.querySelectorAll('.sports-photo-feature, .sports-video-feature'));
      const sportsCards = Array.from(sportsZone.querySelectorAll('.sports-card'));
      return {
        sportsCards: sportsCards.map(c => ({ cls: c.className, style: c.getAttribute('style') })),
        mediaCards: mediaCards.map(c => ({ cls: c.className, style: c.getAttribute('style') }))
      };
    })()`,
    returnByValue: true
  });

  console.log('AFTER 2s AT 1400:', JSON.stringify(after.result.value, null, 2));

  ws.close();
  proc.kill();
}

check();
