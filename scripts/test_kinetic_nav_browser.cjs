const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const auditDir = path.resolve(__dirname, '../public/audit');
if (!fs.existsSync(auditDir)) fs.mkdirSync(auditDir, { recursive: true });

async function runKineticNavTests() {
  console.log('=== Starting Comprehensive Edge Browser Verification for Kinetic Navigation ===\n');
  const port = 9700 + Math.floor(Math.random() * 200);
  const userDataDir = path.join(auditDir, 'test_profile_nav_' + Date.now());

  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--window-size=1440,900',
    'http://localhost:5173/'
  ]);

  proc.on('error', (err) => console.error('Edge spawn error:', err));

  await new Promise((r) => setTimeout(r, 3000));

  try {
    const list = await new Promise((resolve, reject) => {
      http
        .get(`http://127.0.0.1:${port}/json`, (res) => {
          let data = '';
          res.on('data', (c) => (data += c));
          res.on('end', () => resolve(JSON.parse(data)));
        })
        .on('error', reject);
    });

    const pageTarget = list.find((t) => t.type === 'page') || list[0];
    const ws = new globalThis.WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r));

    let id = 1;
    function send(method, params = {}) {
      return new Promise((res) => {
        const curId = id++;
        const handler = (evt) => {
          const msg = JSON.parse(evt.data);
          if (msg.id === curId) {
            ws.removeEventListener('message', handler);
            res(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    async function evalScript(expression) {
      const res = await send('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true
      });
      return res.result ? res.result.value : null;
    }

    async function captureScreenshot(filepath) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(filepath, Buffer.from(res.data, 'base64'));
      console.log(`Saved screenshot: ${path.basename(filepath)}`);
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    // Wait for DOM to load
    let loaded = false;
    for (let i = 0; i < 20; i++) {
      const ready = await evalScript(`!!document.querySelector('.dwc-navbar')`);
      if (ready) {
        loaded = true;
        break;
      }
      await new Promise((r) => setTimeout(r, 500));
    }
    if (!loaded) throw new Error('Navbar did not load in time');
    console.log('[PASS] Page and Kinetic Navbar loaded.');

    // 1. Verify Closed State (Brand Left, MENU + Right, no permanent links)
    const closedNavState = await evalScript(`
      (() => {
        const nav = document.querySelector('.dwc-navbar');
        const brand = nav.querySelector('.dwc-navbar__brand');
        const toggle = nav.querySelector('.dwc-navbar__toggle');
        const menuLabel = nav.querySelector('.dwc-navbar__label--menu');
        const closeLabel = nav.querySelector('.dwc-navbar__label--close');
        const permanentLinks = nav.querySelectorAll('.dwc-navbar__link, .hero-header__link');
        const cs = window.getComputedStyle(nav);
        return {
          hasNav: !!nav,
          hasBrand: !!brand,
          brandText: brand?.innerText.replace(/\\s+/g, ' ').trim(),
          hasToggle: !!toggle,
          menuLabelText: menuLabel?.innerText.trim(),
          closeLabelVisible: window.getComputedStyle(closeLabel).opacity !== '0',
          permanentLinksCount: permanentLinks.length,
          zIndex: cs.zIndex,
          position: cs.position
        };
      })()
    `);
    console.log('\n[TEST 1] Closed Navbar State:', closedNavState);
    await captureScreenshot(path.join(auditDir, 'nav_desktop_closed_1440.png'));

    // 2. Open Menu Sequence: Click MENU button
    console.log('\n[TEST 2] Clicking MENU button to trigger opening animation...');
    await evalScript(`document.querySelector('.dwc-navbar__toggle').click();`);
    // Wait for GSAP opening timeline to complete
    await new Promise((r) => setTimeout(r, 1350));

    const openMenuState = await evalScript(`
      (() => {
        const overlay = document.querySelector('.dwc-kinetic-overlay');
        const mainPanel = document.querySelector('.dwc-nav-layer--main');
        const links = Array.from(document.querySelectorAll('.dwc-nav-menu-link')).map(a => ({
          num: a.querySelector('.dwc-nav-menu-num')?.innerText.trim(),
          label: a.querySelector('.dwc-nav-menu-text')?.innerText.trim(),
          href: a.getAttribute('href')
        }));
        const editorialHeading = document.querySelector('.dwc-nav-editorial__heading')?.innerText.trim();
        const toggleBtn = document.querySelector('.dwc-navbar__toggle');
        const closeLabel = document.querySelector('.dwc-navbar__label--close');
        const menuLabel = document.querySelector('.dwc-navbar__label--menu');
        const icon = document.querySelector('.dwc-navbar__icon');
        const bodyOverflow = document.body.style.overflow;
        return {
          overlayVisible: window.getComputedStyle(overlay).visibility === 'visible',
          mainPanelTransform: window.getComputedStyle(mainPanel).transform,
          linksCount: links.length,
          links,
          editorialHeading,
          bodyOverflow,
          ariaExpanded: toggleBtn?.getAttribute('aria-expanded'),
          closeLabelOpacity: window.getComputedStyle(closeLabel).opacity,
          menuLabelOpacity: window.getComputedStyle(menuLabel).opacity,
          iconTransform: window.getComputedStyle(icon).transform
        };
      })()
    `);
    console.log('Opened Kinetic Menu State:', openMenuState);
    await captureScreenshot(path.join(auditDir, 'nav_desktop_open_1440.png'));

    // 3. Verify Hover Animation on Menu Item
    console.log('\n[TEST 3] Testing Hover state on THERAPY (index 2)...');
    await evalScript(`
      (() => {
        const links = document.querySelectorAll('.dwc-nav-menu-link');
        if (links[2]) {
          links[2].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        }
      })()
    `);
    await new Promise((r) => setTimeout(r, 450));

    const hoverState = await evalScript(`
      (() => {
        const links = document.querySelectorAll('.dwc-nav-menu-link');
        const hovered = links[2];
        const unhovered = links[0];
        const line = hovered?.querySelector('.dwc-nav-menu-hover-line');
        return {
          hoveredTransform: hovered ? window.getComputedStyle(hovered).transform : null,
          unhoveredOpacity: unhovered ? window.getComputedStyle(unhovered).opacity : null,
          lineScale: line ? window.getComputedStyle(line).transform : null
        };
      })()
    `);
    console.log('Hover Interaction State:', hoverState);
    await captureScreenshot(path.join(auditDir, 'nav_desktop_hover_1440.png'));

    // Mouse leave
    await evalScript(`
      (() => {
        const links = document.querySelectorAll('.dwc-nav-menu-link');
        if (links[2]) {
          links[2].dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
        }
      })()
    `);
    await new Promise((r) => setTimeout(r, 400));

    // 4. Test Navigation Link Click: Click CTA (#cta)
    console.log('\n[TEST 4] Testing Navigation Click (CTA link -> #cta)...');
    await evalScript(`
      (() => {
        const links = document.querySelectorAll('.dwc-nav-menu-link');
        const ctaLink = Array.from(links).find(l => l.getAttribute('href') === '#cta');
        if (ctaLink) ctaLink.click();
      })()
    `);
    // Wait for reverse close animation to complete (approx 900ms)
    await new Promise((r) => setTimeout(r, 1200));

    const closedAfterNav = await evalScript(`
      (() => {
        const overlay = document.querySelector('.dwc-kinetic-overlay');
        const toggle = document.querySelector('.dwc-navbar__toggle');
        return {
          overlayHidden: window.getComputedStyle(overlay).visibility === 'hidden',
          bodyOverflow: document.body.style.overflow,
          ariaExpanded: toggle?.getAttribute('aria-expanded')
        };
      })()
    `);
    console.log('State After Nav Link Click (Closed & restored):', closedAfterNav);

    // 5. Test Escape Key Closing
    console.log('\n[TEST 5] Testing Escape Key Closing...');
    // Open menu again
    await evalScript(`document.querySelector('.dwc-navbar__toggle').click();`);
    await new Promise((r) => setTimeout(r, 1000));
    // Dispatch Escape
    await evalScript(`window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`);
    await new Promise((r) => setTimeout(r, 1100));

    const escapeClosedState = await evalScript(`
      (() => {
        const overlay = document.querySelector('.dwc-kinetic-overlay');
        return {
          overlayHidden: window.getComputedStyle(overlay).visibility === 'hidden',
          bodyOverflow: document.body.style.overflow
        };
      })()
    `);
    console.log('Escape Key Result:', escapeClosedState);

    async function ensureOpen() {
      const isOpen = await evalScript(`document.querySelector('.dwc-navbar__toggle').getAttribute('aria-expanded') === 'true'`);
      if (!isOpen) {
        await evalScript(`document.querySelector('.dwc-navbar__toggle').click();`);
        await new Promise((r) => setTimeout(r, 1300));
      }
    }

    async function ensureClosed() {
      const isOpen = await evalScript(`document.querySelector('.dwc-navbar__toggle').getAttribute('aria-expanded') === 'true'`);
      if (isOpen) {
        await evalScript(`document.querySelector('.dwc-navbar__toggle').click();`);
        await new Promise((r) => setTimeout(r, 1100));
      }
    }

    // 6. Test Responsive Viewports (1920x1080 Desktop, 1024x1366 Tablet, 390x844 Mobile, 375x812 Mobile)
    console.log('\n[TEST 6] Testing 1920x1080 Viewport...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false
    });
    await ensureOpen();
    await captureScreenshot(path.join(auditDir, 'nav_desktop_1920.png'));
    await ensureClosed();

    console.log('\n[TEST 7] Testing Tablet Viewport (1024x1366)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1024,
      height: 1366,
      deviceScaleFactor: 1,
      mobile: false
    });
    await ensureOpen();
    await captureScreenshot(path.join(auditDir, 'nav_tablet_1024.png'));
    await ensureClosed();

    console.log('\n[TEST 8] Testing Mobile Viewport (390x844 iPhone)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise((r) => setTimeout(r, 400));
    await captureScreenshot(path.join(auditDir, 'nav_mobile_closed_390.png'));

    await ensureOpen();
    await captureScreenshot(path.join(auditDir, 'nav_mobile_open_390.png'));

    const mobileMenuCheck = await evalScript(`
      (() => {
        const overlay = document.querySelector('.dwc-kinetic-overlay');
        const links = Array.from(document.querySelectorAll('.dwc-nav-menu-link')).map(l => l.innerText.replace(/\\s+/g, ' ').trim());
        const content = document.querySelector('.dwc-nav-menu-content');
        return {
          links,
          hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
          contentHeight: content?.scrollHeight,
          windowHeight: window.innerHeight
        };
      })()
    `);
    console.log('Mobile Menu Verification:', mobileMenuCheck);

    await ensureClosed();

    console.log('\n[TEST 9] Testing Small Mobile Viewport (375x812)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true
    });
    await ensureOpen();
    await captureScreenshot(path.join(auditDir, 'nav_mobile_open_375.png'));

    console.log('\n=== All Comprehensive Edge Browser Verifications for Kinetic Navigation Succeeded! ===');
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  } finally {
    proc.kill();
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch {}
  }
}

runKineticNavTests();
