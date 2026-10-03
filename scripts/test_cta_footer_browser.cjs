const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const auditDir = path.resolve(__dirname, '../public/audit');
if (!fs.existsSync(auditDir)) fs.mkdirSync(auditDir, { recursive: true });

async function runBrowserTests() {
  console.log('=== Starting Chrome/Edge DevTools Protocol Functional & Visual Verification ===\n');
  const port = 9655;
  const userDataDir = path.join(auditDir, 'test_profile_' + Date.now());

  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--window-size=1440,1200',
    'http://127.0.0.1:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

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

    async function captureScreenshot(filepath, clip = null) {
      const params = { format: 'png' };
      if (clip) params.clip = clip;
      const res = await send('Page.captureScreenshot', params);
      fs.writeFileSync(filepath, Buffer.from(res.data, 'base64'));
      console.log(`Saved screenshot: ${path.basename(filepath)}`);
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 1200,
      deviceScaleFactor: 1,
      mobile: false
    });

    await new Promise((r) => setTimeout(r, 1500));

    // 1. Verify CTA Element in DOM
    const ctaInfo = await evalScript(`
      (() => {
        const cta = document.getElementById('cta');
        if (!cta) return null;
        const rect = cta.getBoundingClientRect();
        return {
          id: cta.id,
          top: rect.top + window.scrollY,
          height: rect.height,
          headline: cta.querySelector('.dwc-cta-headline')?.innerText,
          phone: cta.querySelector('a[href="tel:7358313291"]')?.innerText,
          email: cta.querySelector('a[href="mailto:aswinkumar8949@gmail.com"]')?.innerText,
          instagram: cta.querySelector('a[href="https://instagram.com/aswin_reflexologist"]')?.innerText
        };
      })()
    `);
    console.log('[TEST] CTA DOM Check:', ctaInfo);

    // 2. Verify Footer Element in DOM
    const footerInfo = await evalScript(`
      (() => {
        const footer = document.getElementById('footer');
        if (!footer) return null;
        const rect = footer.getBoundingClientRect();
        const navLinks = Array.from(footer.querySelectorAll('.dwc-footer-nav-link')).map(a => ({
          text: a.innerText.trim(),
          href: a.getAttribute('href')
        }));
        return {
          id: footer.id,
          top: rect.top + window.scrollY,
          height: rect.height,
          navLinks,
          hasBrand: !!footer.querySelector('.dwc-footer-brand-title')
        };
      })()
    `);
    console.log('[TEST] Footer DOM Check:', footerInfo);

    // 3. Scroll to CTA and capture desktop screenshot
    await evalScript(`
      document.getElementById('cta').scrollIntoView({ behavior: 'instant', block: 'start' });
    `);
    await new Promise((r) => setTimeout(r, 600));
    await captureScreenshot(path.join(auditDir, 'cta_desktop_1440.png'));

    // 4. Scroll to Footer and capture desktop screenshot
    await evalScript(`
      document.getElementById('footer').scrollIntoView({ behavior: 'instant', block: 'start' });
    `);
    await new Promise((r) => setTimeout(r, 600));
    await captureScreenshot(path.join(auditDir, 'footer_desktop_1440.png'));

    // 5. Test Booking Modal Launch from CTA Button
    console.log('\n[TEST] Testing Booking Modal Launch from CTA Button...');
    const modalLaunchFromCTA = await evalScript(`
      (() => {
        const btn = document.querySelector('.dwc-cta-book-btn');
        if (!btn) return { error: 'CTA button not found' };
        btn.click();
        const modal = document.querySelector('.dwc-booking-modal');
        const bodyOverflow = document.body.style.overflow;
        return {
          modalFound: !!modal,
          bodyOverflow,
          title: modal?.querySelector('.dwc-modal-header__title')?.innerText
        };
      })()
    `);
    console.log('[TEST] Modal Launch Result:', modalLaunchFromCTA);
    await new Promise((r) => setTimeout(r, 500));
    await captureScreenshot(path.join(auditDir, 'booking_modal_desktop_1440.png'));

    // 6. Test Step Selection & Form Filling in Modal
    console.log('\n[TEST] Testing Service Toggle, Slot Selection, Inputs, and WhatsApp generation...');
    const formInteractionResult = await evalScript(`
      (() => {
        // Switch to treatment
        const toggleBtns = document.querySelectorAll('.dwc-toggle-btn');
        if (toggleBtns[1]) toggleBtns[1].click();

        // Fill Name
        const nameInput = document.getElementById('dwc-customer-name');
        if (nameInput) {
          nameInput.value = 'Eleanor Vance';
          nameInput.dispatchEvent(new Event('input', { bubbles: true }));
          nameInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Fill Phone
        const phoneInput = document.getElementById('dwc-customer-phone');
        if (phoneInput) {
          phoneInput.value = '9876543210';
          phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
          phoneInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Fill Treatment Time
        const timeInput = document.getElementById('dwc-treatment-time');
        if (timeInput) {
          timeInput.value = '3:30 PM';
          timeInput.dispatchEvent(new Event('input', { bubbles: true }));
          timeInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Summary Preview
        const summaryRows = Array.from(document.querySelectorAll('.dwc-summary-row')).map(r => ({
          lbl: r.querySelector('.dwc-summary-lbl')?.innerText,
          val: r.querySelector('.dwc-summary-val')?.innerText
        }));

        return {
          name: nameInput?.value,
          phone: phoneInput?.value,
          time: timeInput?.value,
          summaryRows
        };
      })()
    `);
    console.log('[TEST] Form Filled State:', formInteractionResult);

    // Test Escape Key Dismissal
    console.log('\n[TEST] Testing Escape Key dismissal...');
    const escapeResult = await evalScript(`
      (() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        return {
          modalPresent: !!document.querySelector('.dwc-booking-modal'),
          bodyOverflow: document.body.style.overflow
        };
      })()
    `);
    console.log('[TEST] Escape Key Result:', escapeResult);

    // 7. Test Footer Booking Button Trigger
    console.log('\n[TEST] Testing Modal trigger from Footer button...');
    const footerTriggerResult = await evalScript(`
      (() => {
        const btn = document.querySelector('.dwc-footer-btn-appointment');
        if (btn) btn.click();
        return {
          modalPresent: !!document.querySelector('.dwc-booking-modal'),
          bodyOverflow: document.body.style.overflow
        };
      })()
    `);
    console.log('[TEST] Footer Trigger Result:', footerTriggerResult);

    // Close via Close Button
    await evalScript(`
      const closeBtn = document.querySelector('.dwc-modal-close-btn');
      if (closeBtn) closeBtn.click();
    `);
    await new Promise((r) => setTimeout(r, 400));

    // 8. Test Mobile Viewport (390px)
    console.log('\n[TEST] Testing Mobile Layout (390px x 844px)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise((r) => setTimeout(r, 500));

    // Scroll to CTA on mobile
    await evalScript(`
      document.getElementById('cta').scrollIntoView({ behavior: 'instant', block: 'start' });
    `);
    await new Promise((r) => setTimeout(r, 500));
    await captureScreenshot(path.join(auditDir, 'cta_mobile_390.png'));

    // Open Modal on Mobile
    await evalScript(`
      const btn = document.querySelector('.dwc-cta-book-btn');
      if (btn) btn.click();
    `);
    await new Promise((r) => setTimeout(r, 500));
    await captureScreenshot(path.join(auditDir, 'booking_modal_mobile_390.png'));

    // 9. Test Tablet Viewport (1024px)
    console.log('\n[TEST] Testing Tablet Layout (1024px x 1366px)...');
    // Close modal first
    await evalScript(`
      const closeBtn = document.querySelector('.dwc-modal-close-btn');
      if (closeBtn) closeBtn.click();
    `);
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1024,
      height: 1200,
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise((r) => setTimeout(r, 500));
    await evalScript(`
      document.getElementById('cta').scrollIntoView({ behavior: 'instant', block: 'start' });
    `);
    await new Promise((r) => setTimeout(r, 500));
    await captureScreenshot(path.join(auditDir, 'cta_tablet_1024.png'));

    console.log('\n=== All Functional & Visual Browser Tests Completed Successfully! ===');
  } catch (err) {
    console.error('Error during browser testing:', err);
    process.exit(1);
  } finally {
    proc.kill();
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch {}
  }
}

runBrowserTests();
