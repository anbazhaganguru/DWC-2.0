const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function testAll() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dwc-verify-all-'));
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9336;

  console.log('Spawning headless Chrome on port', port, '...');
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tmpDir}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:5173/'
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

  if (!connected) {
    console.error('Failed to connect to Chrome remote debugging port.');
    chrome.kill();
    process.exit(1);
  }

  const ws = new globalThis.WebSocket(tabWsUrl);
  let id = 1;
  const pending = new Map();
  const uncaughtErrors = [];
  const consoleErrors = [];

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
      resolve(data.result);
    }
    if (data.method === 'Runtime.consoleAPICalled') {
      const text = data.params.args.map(a => a.value || a.description || '').join(' ');
      if (data.params.type === 'error') {
        consoleErrors.push(text);
        console.error('[BROWSER ERROR]:', text);
      }
    }
    if (data.method === 'Runtime.exceptionThrown') {
      const desc = data.params.exceptionDetails?.exception?.description || data.params.exceptionDetails?.text;
      uncaughtErrors.push(desc);
      console.error('[UNCAUGHT EXCEPTION]:', desc);
    }
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Log.enable');

  console.log('\n======================================================');
  console.log('1. VERIFYING HOMEPAGE & THERAPY CARD ACCENT LINES');
  console.log('======================================================');
  await send('Page.navigate', { url: 'http://localhost:5173/' });
  await new Promise(r => setTimeout(r, 2500));

  const cardLines = await send('Runtime.evaluate', {
    expression: `(() => {
      const cards = document.querySelectorAll('.therapy-card');
      return Array.from(cards).map((card, i) => {
        const title = card.querySelector('.therapy-card__title')?.textContent?.trim();
        const numEl = card.querySelector('.therapy-card-number-value, .therapy-card__watermark');
        const lineEl = card.querySelector('.therapy-card-number-line, .therapy-card__accent-line');
        const numVal = numEl?.textContent?.trim();
        const numStyle = numEl ? window.getComputedStyle(numEl) : null;
        const lineStyle = lineEl ? window.getComputedStyle(lineEl) : null;
        const lineRect = lineEl ? lineEl.getBoundingClientRect() : null;
        const numRect = numEl ? numEl.getBoundingClientRect() : null;
        const isDark = card.classList.contains('therapy-card--dark');
        
        return {
          index: i + 1,
          title,
          numVal,
          isDark,
          lineVisible: !!lineEl && lineStyle.display !== 'none' && parseFloat(lineStyle.opacity) > 0 && lineStyle.visibility === 'visible',
          lineColor: lineStyle?.backgroundColor,
          lineWidth: lineStyle?.width,
          lineHeight: lineStyle?.height,
          lineDirectlyBeneathNumber: lineRect && numRect ? (lineRect.top >= numRect.bottom - 4) : false
        };
      });
    })()`,
    returnByValue: true
  });

  console.log('Therapy Cards Underline Audit:');
  console.log(JSON.stringify(cardLines?.result?.value, null, 2));

  console.log('\n======================================================');
  console.log('2. VERIFYING ALL 7 DEDICATED SERVICE PAGES & VIDEO SLOTS');
  console.log('======================================================');

  const routes = [
    { name: 'iROBO Massage Chair', path: '/services/irobo-massage-chair', expectedKicker: 'PRODUCT VIDEO' },
    { name: 'Reflexology', path: '/therapy/reflexology', expectedKicker: 'THERAPY VIDEO' },
    { name: 'Taping Therapy', path: '/therapy/taping', expectedKicker: 'THERAPY VIDEO' },
    { name: 'Ice Bath Therapy', path: '/therapy/ice-bath', expectedKicker: 'THERAPY VIDEO' },
    { name: 'Steam Bath', path: '/therapy/steam-bath', expectedKicker: 'THERAPY VIDEO' },
    { name: 'Cupping Therapy', path: '/therapy/cupping', expectedKicker: 'THERAPY VIDEO' },
    { name: 'Bamboo Therapy', path: '/therapy/bamboo', expectedKicker: 'THERAPY VIDEO' }
  ];

  for (const route of routes) {
    console.log(`\nTesting ${route.name} (${route.path})...`);
    await send('Page.navigate', { url: `http://localhost:5173${route.path}` });
    await new Promise(r => setTimeout(r, 1800));

    const pageAudit = await send('Runtime.evaluate', {
      expression: `(() => {
        const title = document.querySelector('.service-hero__title')?.textContent?.trim();
        const videoSection = document.querySelector('.service-video');
        const videoHeading = document.querySelector('#video-heading')?.textContent?.trim();
        const placeholder = document.querySelector('.service-video__placeholder-box');
        const placeholderTitle = document.querySelector('.service-video__placeholder-title')?.textContent?.trim();
        const supportingText = document.querySelector('.service-video__lead-text')?.textContent?.trim();
        const faqCount = document.querySelectorAll('.service-faq__item').length;
        const nextNav = document.querySelector('.service-next-nav__title')?.textContent?.trim();
        const bookingBtn = !!document.querySelector('.service-cta__btn-primary');
        const whatsappBtn = !!document.querySelector('.service-cta__btn-secondary');
        const footer = !!document.querySelector('.service-footer');

        return {
          title,
          hasVideoSection: !!videoSection,
          videoHeading,
          hasPlaceholder: !!placeholder,
          placeholderTitle,
          supportingTextLength: supportingText?.length || 0,
          faqCount,
          nextNav,
          hasBookingCTA: bookingBtn && whatsappBtn,
          hasFooter: footer
        };
      })()`,
      returnByValue: true
    });

    console.log(JSON.stringify(pageAudit?.result?.value, null, 2));
  }

  console.log('\n======================================================');
  console.log('3. ERROR AUDIT SUMMARY');
  console.log('======================================================');
  console.log('Total Uncaught Errors:', uncaughtErrors.length);
  console.log('Total Console Errors:', consoleErrors.length);

  ws.close();
  chrome.kill();
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {}
}

testAll().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
