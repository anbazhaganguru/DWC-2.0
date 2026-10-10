const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function testTargetedRefinements() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dwc-targeted-test-'));
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9355;

  console.log(`Starting headless Chrome on port ${port}...`);
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tmpDir}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:5173/'
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

  await new Promise(r => ws.onopen = r);
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve } = pending.get(data.id);
      pending.delete(data.id);
      const resVal = data.result?.result?.value !== undefined 
        ? data.result.result.value 
        : data.result?.result;
      resolve(resVal);
    }
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  const screenshotsDir = path.join(__dirname, '..', 'scratch_screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  async function capture(filename) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    if (res && res.data) {
      fs.writeFileSync(path.join(screenshotsDir, filename), Buffer.from(res.data, 'base64'));
      console.log(`  [Screenshot saved: ${filename}]`);
    }
  }

  async function waitForSelector(selector, maxMs = 10000) {
    const start = Date.now();
    while (Date.now() - start < maxMs) {
      const res = await send('Runtime.evaluate', {
        expression: `!!document.querySelector('${selector}')`
      });
      if (res === true) return true;
      await new Promise(r => setTimeout(r, 200));
    }
    return false;
  }

  console.log('\n--- 1. Testing Homepage: Founder Name in About Teaser ---');
  await send('Page.navigate', { url: 'http://localhost:5173/' });
  const homeLoaded = await waitForSelector('.about-teaser__cta-btn');
  console.log('Homepage loaded ready:', homeLoaded);


  const aboutTeaserFounder = await send('Runtime.evaluate', {
    expression: `(() => {
      const nameEl = document.querySelector('.about-teaser__founder-name');
      const headlineEl = document.querySelector('.about-teaser__headline');
      const ctaEl = document.querySelector('.about-teaser__cta-btn');
      return {
        founderNamePresent: !!nameEl,
        founderNameText: nameEl ? nameEl.textContent.trim() : null,
        headlineText: headlineEl ? headlineEl.textContent.trim() : null,
        ctaPresent: !!ctaEl,
        ctaHref: ctaEl ? ctaEl.getAttribute('href') : null
      };
    })()`,
    returnByValue: true
  });
  console.log('About Teaser Founder check:', aboutTeaserFounder);

  console.log('\n--- 2. Testing Homepage: Hero "SCROLL TO ROTATE" removal ---');
  const heroCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const heroText = document.querySelector('.hero-section')?.textContent || '';
      const hasScrollToRotate = heroText.includes('SCROLL TO ROTATE');
      const indicatorEl = !!document.querySelector('.hero-scroll-indicator');
      return {
        hasScrollToRotate,
        hasIndicatorElement: indicatorEl
      };
    })()`,
    returnByValue: true
  });
  console.log('Hero "SCROLL TO ROTATE" check:', heroCheck);

  console.log('\n--- 3. Testing Unwanted Technical Labels Website-Wide ---');
  const unwantedLabels = [
    'SWISS EDITORIAL SYSTEM',
    'DWC-2.0',
    'INDEX: 02',
    'DISCIPLINES // 03',
    'SEC 02.1 // PORTRAIT',
    'DANIEL WELLNESS CENTER // FOUNDER PROFILE TEASER',
    'NEXT: CLINICAL MODALITIES [01–06]',
    'SEC 04 / DWC CLINICAL DISCIPLINES',
    'SYSTEM: INTERNATIONAL TYPOGRAPHIC',
    'INDEX: 01–06',
    'VERIFIED • APPARATUS 01',
    'FEATURED • SWISS 12-COL'
  ];

  const homepageBodyText = await send('Runtime.evaluate', {
    expression: 'document.body.innerText'
  });

  const foundUnwantedOnHome = unwantedLabels.filter(label => homepageBodyText.includes(label));
  console.log('Unwanted labels on Homepage:', foundUnwantedOnHome);

  console.log('\n--- 4. Testing Scroll Position Restoration for Card 06 (Cupping Therapy) ---');
  await waitForSelector('.therapy-card--06');
  // Scroll down until Card 06 is in view
  await send('Runtime.evaluate', {
    expression: `(() => {
      const card6 = document.querySelector('.therapy-card--06');
      if (card6) {
        card6.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  const initialCard6Pos = await send('Runtime.evaluate', {
    expression: `(() => {
      const card6 = document.querySelector('.therapy-card--06');
      const rect = card6.getBoundingClientRect();
      return {
        scrollY: window.scrollY,
        card6Top: rect.top,
        card6Bottom: rect.bottom,
        card6Visible: rect.top >= 0 && rect.bottom <= window.innerHeight
      };
    })()`,
    returnByValue: true
  });
  console.log('Initial Card 06 position before clicking:', initialCard6Pos);

  // Click Card 06 to navigate to /therapy/cupping
  console.log('Clicking Card 06 to open detail page...');
  await send('Runtime.evaluate', {
    expression: `document.querySelector('.therapy-card--06').click()`
  });
  await waitForSelector('.service-hero-nav__back-link');
  await new Promise(r => setTimeout(r, 400));

  const detailUrl = await send('Runtime.evaluate', {
    expression: 'window.location.pathname'
  });
  console.log('Current URL on detail page:', detailUrl);

  // Check Sticky behavior of "ALL THERAPY SERVICES"
  console.log('\n--- 5. Testing Sticky Behavior on Therapy Detail Page ---');
  // Check initial sticky position
  const initialNavState = await send('Runtime.evaluate', {
    expression: `(() => {
      const navEl = document.querySelector('.service-hero-nav');
      const linkEl = document.querySelector('.service-hero-nav__back-link');
      const rect = navEl.getBoundingClientRect();
      const style = window.getComputedStyle(navEl);
      return {
        hasNav: !!navEl,
        hasLink: !!linkEl,
        linkText: linkEl?.textContent?.trim(),
        position: style.position,
        topStyle: style.top,
        topPx: rect.top,
        zIndex: style.zIndex
      };
    })()`,
    returnByValue: true
  });
  console.log('Sticky nav initial state:', initialNavState);

  // Scroll down 600px on the detail page
  await send('Runtime.evaluate', {
    expression: 'window.scrollTo({ top: 600, behavior: ' + "'instant'" + ' })'
  });
  await new Promise(r => setTimeout(r, 400));

  const scrolledNavState = await send('Runtime.evaluate', {
    expression: `(() => {
      const navEl = document.querySelector('.service-hero-nav');
      const rect = navEl.getBoundingClientRect();
      return {
        scrollY: window.scrollY,
        navTop: rect.top,
        navHeight: rect.height,
        navVisible: rect.top >= 0 && rect.bottom > 0
      };
    })()`,
    returnByValue: true
  });
  console.log('Sticky nav state while scrolling down 600px:', scrolledNavState);

  // Click "ALL THERAPY SERVICES"
  console.log('\n--- 6. Clicking "ALL THERAPY SERVICES" to return ---');
  await send('Runtime.evaluate', {
    expression: `document.querySelector('.service-hero-nav__back-link').click()`
  });
  await waitForSelector('.therapy-card--06');
  await new Promise(r => setTimeout(r, 1200));


  const returnedHomeData = await send('Runtime.evaluate', {
    expression: `(() => {
      const card6 = document.querySelector('.therapy-card--06');
      const rect = card6 ? card6.getBoundingClientRect() : null;
      return {
        url: window.location.pathname + window.location.hash,
        scrollY: window.scrollY,
        card6Top: rect ? rect.top : null,
        card6Visible: rect ? (rect.top >= 0 && rect.bottom <= window.innerHeight) : false,
        deltaY: rect ? Math.abs(rect.top - ${initialCard6Pos.card6Top}) : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Returned Home Scroll Data (Card 06):', returnedHomeData);

  console.log('\n--- 7. Testing Card 01 (Reflexology) ---');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const card1 = document.querySelector('.therapy-card--01');
      if (card1) card1.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  const initialCard1Pos = await send('Runtime.evaluate', {
    expression: `(() => {
      const card = document.querySelector('.therapy-card--01');
      const rect = card.getBoundingClientRect();
      return { scrollY: window.scrollY, top: rect.top };
    })()`,
    returnByValue: true
  });

  await send('Runtime.evaluate', {
    expression: `document.querySelector('.therapy-card--01').click()`
  });
  await new Promise(r => setTimeout(r, 1000));

  await send('Runtime.evaluate', {
    expression: `document.querySelector('.service-hero-nav__back-link').click()`
  });
  await new Promise(r => setTimeout(r, 1500));

  const returnedCard1Data = await send('Runtime.evaluate', {
    expression: `(() => {
      const card = document.querySelector('.therapy-card--01');
      const rect = card ? card.getBoundingClientRect() : null;
      return {
        scrollY: window.scrollY,
        top: rect ? rect.top : null,
        deltaY: rect ? Math.abs(rect.top - ${initialCard1Pos.top}) : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Returned Home Scroll Data (Card 01):', returnedCard1Data);

  console.log('\n--- 8. Testing Apparatus (iROBO) ---');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const app = document.querySelector('.therapy-apparatus-section');
      if (app) app.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  const initialAppPos = await send('Runtime.evaluate', {
    expression: `(() => {
      const app = document.querySelector('.therapy-apparatus-section');
      const rect = app.getBoundingClientRect();
      return { scrollY: window.scrollY, top: rect.top };
    })()`,
    returnByValue: true
  });

  await send('Runtime.evaluate', {
    expression: `document.querySelector('.therapy-apparatus__btn').click()`
  });
  await new Promise(r => setTimeout(r, 1000));

  await send('Runtime.evaluate', {
    expression: `document.querySelector('.service-hero-nav__back-link').click()`
  });
  await new Promise(r => setTimeout(r, 1500));

  const returnedAppData = await send('Runtime.evaluate', {
    expression: `(() => {
      const app = document.querySelector('.therapy-apparatus-section');
      const rect = app ? app.getBoundingClientRect() : null;
      return {
        scrollY: window.scrollY,
        top: rect ? rect.top : null,
        deltaY: rect ? Math.abs(rect.top - ${initialAppPos.top}) : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Returned Home Scroll Data (Apparatus):', returnedAppData);

  console.log('\n--- 9. Direct Navigation & Browser History Back/Forward ---');
  // Direct navigation to /therapy/bamboo
  await send('Page.navigate', { url: 'http://localhost:5173/therapy/bamboo' });
  await new Promise(r => setTimeout(r, 1500));
  // Click back link
  await send('Runtime.evaluate', {
    expression: `document.querySelector('.service-hero-nav__back-link').click()`
  });
  await new Promise(r => setTimeout(r, 1500));
  const directFallbackUrl = await send('Runtime.evaluate', {
    expression: 'window.location.pathname + window.location.hash'
  });
  console.log('Direct visit back URL:', directFallbackUrl);

  chrome.kill();
  process.exit(0);
}

testTargetedRefinements().catch(e => {
  console.error(e);
  process.exit(1);
});
