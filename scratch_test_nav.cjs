const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function testNavigation() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dwc-nav-test-'));
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9342;

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tmpDir}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:5173/#about'
  ]);

  let connected = false;
  let tabWsUrl = '';
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json`);
      const tabs = await res.json();
      const pageTab = tabs.find(t => t.type === 'page');
      if (pageTab && pageTab.webSocketDebuggerUrl) {
        tabWsUrl = pageTab.webSocketDebuggerUrl;
        connected = true;
        break;
      }
    } catch {}
  }

  const ws = new globalThis.WebSocket(tabWsUrl);
  let id = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      pending.set(msgId, { resolve });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await new Promise(r => ws.onopen = r);
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve } = pending.get(data.id);
      pending.delete(data.id);
      resolve(data.result?.result ? data.result.result.value : data.result);
    }
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: 'http://localhost:5173/' });
  
  // Wait until .about-teaser__cta-btn is present
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 300));
    const hasBtn = await send('Runtime.evaluate', {
      expression: `!!document.querySelector('.about-teaser__cta-btn')`
    });
    if (hasBtn) {
      console.log('Button found on homepage after', (i * 300), 'ms');
      break;
    }
  }

  console.log('1. On homepage #about, clicking VIEW FOUNDER button...');
  const clickRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('.about-teaser__cta-btn');
      if (!btn) return 'BUTTON NOT FOUND';
      btn.click();
      return 'CLICKED';
    })()`
  });
  console.log('Click result:', clickRes);
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    const hasBack = await send('Runtime.evaluate', {
      expression: `!!document.querySelector('.founder-back-link')`
    });
    if (hasBack) {
      console.log('Founder page loaded and back link found after', (i * 200), 'ms');
      break;
    }
  }

  const afterClickUrl = await send('Runtime.evaluate', {
    expression: 'window.location.pathname'
  });
  console.log('Current URL path after clicking VIEW FOUNDER:', afterClickUrl);

  console.log('2. On /about/founder, clicking BACK TO ABOUT button...');
  const backClickRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const backLink = document.querySelector('.founder-back-link');
      if (!backLink) return 'BACK LINK NOT FOUND';
      backLink.click();
      return 'CLICKED';
    })()`
  });
  console.log('Back click result:', backClickRes);

  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    const isHome = await send('Runtime.evaluate', {
      expression: `window.location.pathname === '/'`
    });
    if (isHome) {
      console.log('Navigated back to home after', (i * 200), 'ms');
      break;
    }
  }

  const afterBackUrl = await send('Runtime.evaluate', {
    expression: 'window.location.pathname + window.location.hash'
  });
  console.log('Current URL after clicking BACK TO ABOUT:', afterBackUrl);

  chrome.kill();
  process.exit(0);
}

testNavigation().catch(e => {
  console.error(e);
  process.exit(1);
});
