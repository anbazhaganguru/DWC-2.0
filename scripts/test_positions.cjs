const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function testPositions() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dwc-pos-test-'));
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9365;

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

  const results = await send('Runtime.evaluate', {
    expression: `(() => {
      const page = document.querySelector('.service-detail-page');
      page.style.overflow = 'visible';
      page.style.overflowX = 'clip';

      const nav = document.querySelector('.service-hero-nav');
      const main = document.querySelector('.service-detail-main');

      // Move nav outside main, before main
      page.insertBefore(nav, main);
      nav.style.marginTop = 'clamp(64px, 8vh, 88px)';
      main.style.paddingTop = '0';

      const serializeRect = (r) => r ? ({ top: Math.round(r.top), bottom: Math.round(r.bottom), height: Math.round(r.height) }) : null;
      const navbar = document.querySelector('.dwc-navbar');

      const testScrolls = [0, 200, 800, 2000, 5000, document.documentElement.scrollHeight - window.innerHeight];
      const records = [];

      for (const y of testScrolls) {
        window.scrollTo({ top: y, behavior: 'instant' });
        const navRect = serializeRect(nav.getBoundingClientRect());
        const nbRect = serializeRect(navbar.getBoundingClientRect());
        records.push({
          scrollY: y,
          actualScrollY: window.scrollY,
          navbarBottom: nbRect.bottom,
          navTop: navRect.top,
          navBottom: navRect.bottom,
          gap: navRect.top - nbRect.bottom
        });
      }

      return records;
    })()`,
    returnByValue: true
  });

  console.log('TEST RESULTS:\n', JSON.stringify(results.result.value, null, 2));

  chrome.kill();
  process.exit(0);
}

testPositions();
