const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = path.resolve(__dirname, '../public/audit/test_scratch');
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

async function runTest() {
  const port = 9640;
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${path.join(scratchDir, 'edge-profile-test')}`,
    '--window-size=1440,900',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/json`, res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const pageTarget = list.find(t => t.type === 'page') || list[0];
    const ws = new globalThis.WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    const callbacks = new Map();
    let onLoadFired = null;

    ws.addEventListener('message', evt => {
      const msg = JSON.parse(evt.data);
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg.result);
        callbacks.delete(msg.id);
      }
      if (msg.method === 'Page.loadEventFired' && onLoadFired) {
        onLoadFired();
      }
    });

    function send(method, params = {}) {
      return new Promise(res => {
        const curId = id++;
        callbacks.set(curId, res);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');

    const loadPromise = new Promise(r => onLoadFired = r);
    await send('Page.navigate', { url: 'http://localhost:5173/' });
    await loadPromise;
    await new Promise(r => setTimeout(r, 3000));

    // Scroll Recovery into view
    await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('#recovery');
        if (sec) sec.scrollIntoView({ block: 'center' });
      })()`
    });

    await new Promise(r => setTimeout(r, 1000));

    // 1. Initial State Check
    const initialCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const track = document.querySelector('.recovery-carousel-track');
        const cards = Array.from(document.querySelectorAll('.recovery-card')).map(c => c.querySelector('.recovery-card__title')?.textContent);
        const counter = document.querySelector('.recovery-header__counter')?.textContent;
        const transform = track ? window.getComputedStyle(track).transform : null;
        return {
          totalCards: cards.length,
          firstSixTitles: cards.slice(0, 6),
          secondSixTitles: cards.slice(6, 12),
          counter,
          transform
        };
      })()`,
      returnByValue: true
    });
    console.log('1. Initial Carousel Setup:', JSON.stringify(initialCheck.result.value, null, 2));

    // 2. Auto-scroll continuous motion check
    const transformT1 = await send('Runtime.evaluate', {
      expression: `document.querySelector('.recovery-carousel-track')?.style.transform`,
      returnByValue: true
    });

    await new Promise(r => setTimeout(r, 1500));

    const transformT2 = await send('Runtime.evaluate', {
      expression: `document.querySelector('.recovery-carousel-track')?.style.transform`,
      returnByValue: true
    });

    console.log('2. Auto-scroll movement check:');
    console.log('  T1:', transformT1.result.value);
    console.log('  T2 (1.5s later):', transformT2.result.value);
    const hasMoved = transformT1.result.value !== transformT2.result.value;
    console.log('  Is moving continuously:', hasMoved);

    // 3. Hover pause check
    await send('Runtime.evaluate', {
      expression: `(() => {
        const wrapper = document.querySelector('.recovery-carousel-wrapper');
        if (wrapper) {
          wrapper.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
          wrapper.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
        }
      })()`
    });

    await new Promise(r => setTimeout(r, 400));
    const hoverT1 = await send('Runtime.evaluate', {
      expression: `document.querySelector('.recovery-carousel-track')?.style.transform`,
      returnByValue: true
    });

    await new Promise(r => setTimeout(r, 1000));
    const hoverT2 = await send('Runtime.evaluate', {
      expression: `document.querySelector('.recovery-carousel-track')?.style.transform`,
      returnByValue: true
    });

    console.log('3. Hover pause check:');
    console.log('  Hover T1:', hoverT1.result.value);
    console.log('  Hover T2 (1s later while hovered):', hoverT2.result.value);
    const isPausedOnHover = hoverT1.result.value === hoverT2.result.value;
    console.log('  Is paused on hover:', isPausedOnHover);

    // Resume on mouse leave
    await send('Runtime.evaluate', {
      expression: `(() => {
        const wrapper = document.querySelector('.recovery-carousel-wrapper');
        if (wrapper) {
          wrapper.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
          wrapper.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
        }
      })()`
    });

    await new Promise(r => setTimeout(r, 1000));
    const resumeT = await send('Runtime.evaluate', {
      expression: `document.querySelector('.recovery-carousel-track')?.style.transform`,
      returnByValue: true
    });
    console.log('  Resume T (after mouse leave):', resumeT.result.value);
    console.log('  Resumed successfully:', resumeT.result.value !== hoverT2.result.value);

    // 4. Horizontal Trackpad wheel check
    await send('Runtime.evaluate', {
      expression: `(() => {
        const wrapper = document.querySelector('.recovery-carousel-wrapper');
        if (wrapper) {
          wrapper.dispatchEvent(new WheelEvent('wheel', { deltaX: 200, deltaY: 0, cancelable: true }));
        }
      })()`
    });

    await new Promise(r => setTimeout(r, 100));
    const wheelT = await send('Runtime.evaluate', {
      expression: `document.querySelector('.recovery-carousel-track')?.style.transform`,
      returnByValue: true
    });
    console.log('4. Trackpad horizontal swipe check:');
    console.log('  After deltaX 200 wheel event:', wheelT.result.value);

    ws.close();
    proc.kill();
    process.exit(0);
  } finally {
    proc.kill();
    process.exit(0);
  }
}

runTest().catch(console.error);
