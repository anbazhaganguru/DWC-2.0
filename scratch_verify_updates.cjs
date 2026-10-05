const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function runVerification() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dwc-verify-updates-'));
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9338;

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
      resolve(data.result?.result ? data.result.result.value : data.result);
    }
    if (data.method === 'Runtime.consoleAPICalled') {
      const text = data.params.args.map(a => a.value || a.description || '').join(' ');
      if (data.params.type === 'error') {
        consoleErrors.push(text);
        console.error('[BROWSER ERROR]:', text);
      }
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

  const screenshotsDir = path.join(__dirname, 'scratch_screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  async function capture(filename) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    if (res && res.data) {
      fs.writeFileSync(path.join(screenshotsDir, filename), Buffer.from(res.data, 'base64'));
      console.log(`Saved screenshot: ${filename}`);
    }
  }

  console.log('\n======================================================');
  console.log('1. VERIFYING HOMEPAGE ABOUT TEASER SECTION');
  console.log('======================================================');
  await send('Page.navigate', { url: 'http://localhost:5173/#about' });
  await new Promise(r => setTimeout(r, 2500));

  const aboutTeaserData = await send('Runtime.evaluate', {
    expression: `(() => {
      const aboutSec = document.querySelector('#about');
      if (!aboutSec) return { found: false };
      const rect = aboutSec.getBoundingClientRect();
      const topBar = aboutSec.querySelector('.about-top-bar')?.textContent?.trim();
      const title = aboutSec.querySelector('.about-teaser__headline')?.textContent?.trim();
      const founderPlaceholder = !!aboutSec.querySelector('.founder-placeholder');
      const lead = aboutSec.querySelector('.about-teaser__lead')?.textContent?.trim();
      const disciplines = Array.from(aboutSec.querySelectorAll('.about-teaser__discipline-title')).map(el => el.textContent.trim());
      const ctaBtn = aboutSec.querySelector('.about-teaser__cta-btn');
      const ctaText = ctaBtn?.textContent?.trim();
      const ctaHref = ctaBtn?.getAttribute('href');

      // Check for removed detailed sections
      const hasEducation = !!aboutSec.querySelector('.founder-education-zone');
      const hasSports = !!aboutSec.querySelector('.founder-sports-zone');
      const hasRecords = !!aboutSec.querySelector('.founder-records-zone');
      const hasWellness = !!aboutSec.querySelector('.founder-wellness-zone');
      const hasVision = !!aboutSec.querySelector('.about-vision-zone');

      return {
        found: true,
        heightPx: rect.height,
        viewportHeightRatio: (rect.height / window.innerHeight).toFixed(2),
        topBar,
        title,
        founderPlaceholder,
        lead,
        disciplines,
        ctaText,
        ctaHref,
        hasEducation,
        hasSports,
        hasRecords,
        hasWellness,
        hasVision
      };
    })()`,
    returnByValue: true
  });

  console.log('Homepage About Teaser Result:', JSON.stringify(aboutTeaserData, null, 2));

  // Scroll to about section and capture screenshot
  await send('Runtime.evaluate', {
    expression: `document.querySelector('#about')?.scrollIntoView({ behavior: 'instant' })`
  });
  await new Promise(r => setTimeout(r, 800));
  await capture('01_homepage_about_teaser_desktop.png');

  // Mobile viewport test for about teaser
  console.log('\n--- Mobile Viewport Test (390x844) ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 500));
  await send('Runtime.evaluate', {
    expression: `document.querySelector('#about')?.scrollIntoView({ behavior: 'instant' })`
  });
  await new Promise(r => setTimeout(r, 500));

  const mobileAboutData = await send('Runtime.evaluate', {
    expression: `(() => {
      const aboutSec = document.querySelector('#about');
      const rect = aboutSec.getBoundingClientRect();
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;
      return {
        heightPx: rect.height,
        viewportRatio: (rect.height / window.innerHeight).toFixed(2),
        hasHorizontalOverflow: scrollWidth > clientWidth
      };
    })()`,
    returnByValue: true
  });
  console.log('Mobile About Data:', JSON.stringify(mobileAboutData, null, 2));
  await capture('02_homepage_about_teaser_mobile.png');

  // Switch back to desktop
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('\n======================================================');
  console.log('2. VERIFYING DEDICATED FOUNDER PAGE (/about/founder)');
  console.log('======================================================');
  await send('Page.navigate', { url: 'http://localhost:5173/about/founder' });
  await new Promise(r => setTimeout(r, 2000));

  const founderPageData = await send('Runtime.evaluate', {
    expression: `(() => {
      const title = document.title;
      const backLink = document.querySelector('.founder-back-link')?.textContent?.trim();
      const backHref = document.querySelector('.founder-back-link')?.getAttribute('href');

      const sections = Array.from(document.querySelectorAll('.founder-section')).map((sec, i) => {
        const isLight = sec.classList.contains('founder-section--light');
        const isDark = sec.classList.contains('founder-section--dark');
        const heading = sec.querySelector('h1, h2, h3, h4')?.textContent?.trim();
        return {
          index: i + 1,
          theme: isLight ? 'LIGHT (White)' : (isDark ? 'DARK (Black)' : 'OTHER'),
          firstHeading: heading
        };
      });

      // Verify specific required content pieces
      const bodyText = document.body.textContent;
      const checks = {
        hasBScPsychology: bodyText.includes('B.Sc. Psychology') && bodyText.includes('PSG College of Arts and Science'),
        hasMScClinicalPsychology: bodyText.includes('M.Sc. Clinical Psychology') && bodyText.includes('Dr. M.G.R. University') && bodyText.includes('CURRENTLY STUDYING'),
        hasBasketball: bodyText.includes('Basketball') && bodyText.includes('State-Level Representation') && bodyText.includes('Player / Coach'),
        hasNetball: bodyText.includes('Netball') && bodyText.includes('Senior National South Zone Silver Medal'),
        hasAsiaRecord: bodyText.includes('210') && bodyText.includes('59.98') && bodyText.includes('ASIA BOOK OF RECORDS'),
        hasIndianRecord: bodyText.includes('385') && bodyText.includes('INDIAN BOOK OF WORLD RECORDS'),
        hasReflexology: bodyText.includes('FOOT REFLEXOLOGY'),
        hasTaping: bodyText.includes('TAPING THERAPY'),
        hasCupping: bodyText.includes('CUPPING THERAPY'),
        hasVision: bodyText.includes('TWO DISCIPLINES. ONE DIRECTION') && bodyText.includes('Ambattur')
      };

      return {
        title,
        backLink,
        backHref,
        sectionsCount: sections.length,
        sections,
        contentChecks: checks
      };
    })()`,
    returnByValue: true
  });

  console.log('Founder Page Verification:', JSON.stringify(founderPageData, null, 2));
  await capture('03_founder_page_top.png');

  // Scroll down to Education & Sports
  await send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 800, behavior: 'instant' })`
  });
  await new Promise(r => setTimeout(r, 600));
  await capture('04_founder_page_education_sports.png');

  // Scroll down to Records & Wellness
  await send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 1600, behavior: 'instant' })`
  });
  await new Promise(r => setTimeout(r, 600));
  await capture('05_founder_page_records_wellness.png');

  console.log('\n======================================================');
  console.log('3. VERIFYING 7 THERAPY DETAIL PAGES & IMAGE SIZES');
  console.log('======================================================');
  const therapyRoutes = [
    { name: 'iROBO Massage Chair', path: '/services/irobo-massage-chair' },
    { name: 'Reflexology', path: '/therapy/reflexology' },
    { name: 'Taping Therapy', path: '/therapy/taping' },
    { name: 'Ice Bath Therapy', path: '/therapy/ice-bath' },
    { name: 'Steam Bath', path: '/therapy/steam-bath' },
    { name: 'Cupping Therapy', path: '/therapy/cupping' },
    { name: 'Bamboo Therapy', path: '/therapy/bamboo' }
  ];

  for (const route of therapyRoutes) {
    await send('Page.navigate', { url: `http://localhost:5173${route.path}` });
    await new Promise(r => setTimeout(r, 1500));

    const imgData = await send('Runtime.evaluate', {
      expression: `(() => {
        const wrap = document.querySelector('.service-hero__image-wrap');
        const img = document.querySelector('.service-hero__image');
        const title = document.querySelector('.service-hero__title')?.textContent?.trim();
        if (!wrap) return { found: false };
        const wrapRect = wrap.getBoundingClientRect();
        const imgRect = img ? img.getBoundingClientRect() : null;
        return {
          found: true,
          title,
          wrapWidth: Math.round(wrapRect.width),
          wrapHeight: Math.round(wrapRect.height),
          wrapMaxWidthCss: window.getComputedStyle(wrap).maxWidth,
          wrapMaxHeightCss: window.getComputedStyle(wrap).maxHeight,
          imgNaturalWidth: img?.naturalWidth,
          imgNaturalHeight: img?.naturalHeight,
          imgDisplayWidth: imgRect ? Math.round(imgRect.width) : 0,
          imgDisplayHeight: imgRect ? Math.round(imgRect.height) : 0
        };
      })()`,
      returnByValue: true
    });

    console.log(`Route [${route.name}] (${route.path}):`, JSON.stringify(imgData));
  }

  // Capture reflexology and irobo detail page hero
  await send('Page.navigate', { url: 'http://localhost:5173/services/irobo-massage-chair' });
  await new Promise(r => setTimeout(r, 1000));
  await capture('06_detail_irobo_desktop.png');

  await send('Page.navigate', { url: 'http://localhost:5173/therapy/reflexology' });
  await new Promise(r => setTimeout(r, 1000));
  await capture('07_detail_reflexology_desktop.png');

  // Mobile detail page test
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Page.navigate', { url: 'http://localhost:5173/therapy/reflexology' });
  await new Promise(r => setTimeout(r, 1200));

  const mobileDetailImg = await send('Runtime.evaluate', {
    expression: `(() => {
      const wrap = document.querySelector('.service-hero__image-wrap');
      const rect = wrap?.getBoundingClientRect();
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;
      return {
        wrapWidth: rect ? Math.round(rect.width) : 0,
        wrapHeight: rect ? Math.round(rect.height) : 0,
        hasHorizontalOverflow: scrollWidth > clientWidth
      };
    })()`,
    returnByValue: true
  });
  console.log('\nMobile Detail Page Image Data:', JSON.stringify(mobileDetailImg));
  await capture('08_detail_reflexology_mobile.png');

  console.log('\n======================================================');
  console.log('4. HOMEPAGE THERAPY CARDS INTEGRITY CHECK');
  console.log('======================================================');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await send('Page.navigate', { url: 'http://localhost:5173/#therapy' });
  await new Promise(r => setTimeout(r, 1500));

  const therapyCardsData = await send('Runtime.evaluate', {
    expression: `(() => {
      const apparatus = document.querySelector('.therapy-apparatus');
      const cards = document.querySelectorAll('.therapy-card');
      return {
        hasApparatus: !!apparatus,
        cardCount: cards.length,
        totalTherapies: (apparatus ? 1 : 0) + cards.length,
        titles: [
          apparatus?.querySelector('.apparatus-content__title')?.textContent?.trim(),
          ...Array.from(cards).map(c => c.querySelector('.therapy-card__title')?.textContent?.trim())
        ]
      };
    })()`,
    returnByValue: true
  });
  console.log('Therapy Cards on Homepage:', JSON.stringify(therapyCardsData, null, 2));

  console.log('\nConsole Errors during run:', consoleErrors.length ? consoleErrors : 'NONE');

  chrome.kill();
  process.exit(0);
}

runVerification().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
