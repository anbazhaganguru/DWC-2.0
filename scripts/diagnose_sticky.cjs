const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function diagnose() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dwc-diag-'));
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9360;

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tmpDir}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:5173/services/irobo-massage-chair'
  ]);

  let tabWsUrl = '';
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json`);
      const tabs = await res.json();
      const pageTab = tabs.find(t => t.type === 'page');
      if (pageTab && pageTab.webSocketDebuggerUrl) {
        tabWsUrl = pageTab.webSocketDebuggerUrl;
        break;
      }
    } catch {}
  }

  if (!tabWsUrl) {
    console.error('Failed to connect to Chrome debugging port.');
    chrome.kill();
    process.exit(1);
  }

  const ws = new globalThis.WebSocket(tabWsUrl);
  let msgId = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      pending.set(id, { resolve });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve } = pending.get(data.id);
      pending.delete(data.id);
      resolve(data.result);
    }
  };

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');

  for (let i = 0; i < 30; i++) {
    const check = await send('Runtime.evaluate', {
      expression: '!!document.querySelector(".service-hero-nav")'
    });
    if (check.result?.value) break;
    await new Promise(r => setTimeout(r, 200));
  }

  const diag = await send('Runtime.evaluate', {
    expression: `(() => {
      const nav = document.querySelector('.service-hero-nav');
      if (!nav) return { error: 'No .service-hero-nav found' };

      // Collect ancestors
      const ancestors = [];
      let el = nav.parentElement;
      while (el) {
        const cs = window.getComputedStyle(el);
        ancestors.push({
          tag: el.tagName.toLowerCase(),
          id: el.id,
          class: el.className,
          overflow: cs.overflow,
          overflowX: cs.overflowX,
          overflowY: cs.overflowY,
          position: cs.position,
          transform: cs.transform,
          contain: cs.contain,
          filter: cs.filter,
          height: cs.height,
          maxHeight: cs.maxHeight
        });
        el = el.parentElement;
      }

      const serializeRect = (r) => r ? ({ top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height }) : null;

      const navbar = document.querySelector('.dwc-navbar');
      const navbarRect = serializeRect(navbar ? navbar.getBoundingClientRect() : null);

      const navRectBefore = serializeRect(nav.getBoundingClientRect());
      const csNav = window.getComputedStyle(nav);

      // Change .service-detail-page overflow to test
      const page = document.querySelector('.service-detail-page');
      if (page) {
        page.style.overflow = 'visible';
        page.style.overflowX = 'clip';
      }

      // Now scroll all the way down to bottom
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll, behavior: 'instant' });
      return new Promise(resolve => {
        setTimeout(() => {
          const navRectAfter = serializeRect(nav.getBoundingClientRect());
          resolve({
            navbarRect,
            navRectBefore,
            navRectAfter,
            maxScroll,
            windowScrollY: window.scrollY
          });
        }, 100);
      });
    })()`,
    awaitPromise: true,
    returnByValue: true
  });

  console.log('DIAGNOSTIC RESULT:\n', JSON.stringify(diag.result.value, null, 2));

  chrome.kill();
  process.exit(0);
}

diagnose();
