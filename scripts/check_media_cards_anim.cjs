const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function checkGsapTween() {
  const port = 9717;
  const proc = spawn(edgePath, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    '--remote-debugging-port=' + port, '--user-data-dir=C:\\Users\\FKode solutiona\\.gemini\\antigravity-ide\\brain\\7ebc22a0-1f85-4c26-9f4e-4980e84d3ce2\\scratch\\edge-test-17',
    '--window-size=1440,1000'
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
  await send('Page.navigate', { url: 'http://localhost:5173/about/founder' });
  await new Promise(r => setTimeout(r, 2000));

  // Let's inspect console messages
  ws.addEventListener('message', e => {
    const d = JSON.parse(e.data);
    if (d.method === 'Runtime.consoleAPICalled') {
      console.log('CONSOLE:', d.params.args.map(a => a.value || a.description).join(' '));
    }
  });

  const animDetails = await send('Runtime.evaluate', {
    expression: `(() => {
      // Find all GSAP animations
      const sportsZone = document.querySelector('.founder-sports-zone');
      const mediaCards = sportsZone.querySelectorAll('.sports-photo-feature, .sports-video-feature');
      return {
        card0: {
          tag: mediaCards[0]?.className,
          style: mediaCards[0]?.getAttribute('style'),
          computedOp: window.getComputedStyle(mediaCards[0]).opacity
        },
        card1: {
          tag: mediaCards[1]?.className,
          style: mediaCards[1]?.getAttribute('style'),
          computedOp: window.getComputedStyle(mediaCards[1]).opacity
        }
      };
    })()`,
    returnByValue: true
  });
  console.log('Initial anim state:', animDetails.result.value);

  // Now trigger scroll to sportsZone
  await send('Runtime.evaluate', {
    expression: `(() => {
      const sportsZone = document.querySelector('.founder-sports-zone');
      sportsZone.scrollIntoView({ behavior: 'instant', block: 'start' });
      window.dispatchEvent(new Event('scroll'));
    })()`
  });

  await new Promise(r => setTimeout(r, 2000));

  const afterAnim = await send('Runtime.evaluate', {
    expression: `(() => {
      const sportsZone = document.querySelector('.founder-sports-zone');
      const mediaCards = sportsZone.querySelectorAll('.sports-photo-feature, .sports-video-feature');
      return {
        card0: {
          tag: mediaCards[0]?.className,
          style: mediaCards[0]?.getAttribute('style'),
          computedOp: window.getComputedStyle(mediaCards[0]).opacity
        },
        card1: {
          tag: mediaCards[1]?.className,
          style: mediaCards[1]?.getAttribute('style'),
          computedOp: window.getComputedStyle(mediaCards[1]).opacity
        }
      };
    })()`,
    returnByValue: true
  });
  console.log('After scrollIntoView anim state:', afterAnim.result.value);

  ws.close();
  proc.kill();
}
checkGsapTween();
