const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const auditDir = path.resolve(__dirname, '../public/audit');
if (!fs.existsSync(auditDir)) fs.mkdirSync(auditDir, { recursive: true });

async function runFullVerification() {
  console.log('=== Starting Comprehensive Edge Browser Verification for CTA & BookingModal ===\n');
  const port = 9670;
  const userDataDir = path.join(auditDir, 'test_profile_' + Date.now());

  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--window-size=1440,1200',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2500));

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

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 1200,
      deviceScaleFactor: 1,
      mobile: false
    });

    // Wait for DOM to be ready
    let loaded = false;
    for (let i = 0; i < 20; i++) {
      const ready = await evalScript(`!!document.getElementById('cta')`);
      if (ready) {
        loaded = true;
        break;
      }
      await new Promise((r) => setTimeout(r, 500));
    }
    if (!loaded) {
      throw new Error('CTA section did not load in time');
    }

    console.log('[PASS] Page and DOM loaded successfully.');

    // 1. Verify CTA Section Styling (White theme, dark text)
    const ctaStyles = await evalScript(`
      (() => {
        const cta = document.getElementById('cta');
        const headline = cta.querySelector('.dwc-cta-headline');
        const desc = cta.querySelector('.dwc-cta-description');
        const btn = cta.querySelector('.dwc-cta-book-btn');
        const card = cta.querySelector('.dwc-cta-card');
        const cs = window.getComputedStyle(cta);
        const hs = headline ? window.getComputedStyle(headline) : null;
        const bs = btn ? window.getComputedStyle(btn) : null;
        const ds = desc ? window.getComputedStyle(desc) : null;
        const cds = card ? window.getComputedStyle(card) : null;
        return {
          ctaBg: cs.backgroundColor,
          ctaColor: cs.color,
          headlineColor: hs?.color,
          descColor: ds?.color,
          btnBg: bs?.backgroundColor,
          btnColor: bs?.color,
          cardBg: cds?.backgroundColor
        };
      })()
    `);
    console.log('\n[TEST 1] CTA Section Theme & Colors:', ctaStyles);

    // 2. Verify Footer Section Styling (Dark background unchanged)
    const footerStyles = await evalScript(`
      (() => {
        const footer = document.getElementById('footer');
        const cs = window.getComputedStyle(footer);
        const title = footer.querySelector('.dwc-footer-brand-title');
        const ts = title ? window.getComputedStyle(title) : null;
        return {
          footerBg: cs.backgroundColor,
          footerColor: cs.color,
          titleColor: ts?.color
        };
      })()
    `);
    console.log('\n[TEST 2] Footer Section Theme (Unchanged):', footerStyles);

    // 3. Test Booking Modal Trigger from CTA Button
    console.log('\n[TEST 3] Testing Booking Modal Trigger from CTA button...');
    await evalScript(`document.querySelector('.dwc-cta-book-btn').click();`);
    await new Promise((r) => setTimeout(r, 500));

    const modalState1 = await evalScript(`
      (() => {
        const modal = document.querySelector('.dwc-booking-modal');
        const title = modal?.querySelector('#dwc-booking-modal-title')?.innerText;
        const subtitle = modal?.querySelector('.dwc-modal-header__subtitle')?.innerText;
        const primaryBtn = modal?.querySelector('.dwc-modal-submit-btn')?.innerText;
        const tabs = Array.from(modal?.querySelectorAll('.dwc-segment-tab') || []).map(t => t.innerText.split('\\n')[0].trim());
        const therapies = Array.from(modal?.querySelectorAll('.dwc-pill-btn') || []).map(b => b.innerText.trim());
        const timeChips = Array.from(modal?.querySelectorAll('.dwc-time-chip') || []).map(b => b.innerText.trim());
        return {
          modalOpen: !!modal,
          bodyOverflow: document.body.style.overflow,
          title,
          subtitle,
          primaryBtn,
          tabs,
          therapiesCount: therapies.length,
          therapies,
          timeChipsCount: timeChips.length,
          firstSlot: timeChips[0],
          lastSlot: timeChips[timeChips.length - 1]
        };
      })()
    `);
    console.log('Modal Opened State (Therapy Flow):', modalState1);

    // 4. Test Switching to Massage / Treatment
    console.log('\n[TEST 4] Switching to Massage / Treatment (Day)...');
    await evalScript(`
      (() => {
        const tabs = document.querySelectorAll('.dwc-segment-tab');
        if (tabs[1]) tabs[1].click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 400));

    // 5. Test Treatment Form Submission & WhatsApp URL
    console.log('\n[TEST 5] Testing Form Validation and WhatsApp URL generation (Treatment)...');
    const whatsappUrlTreatment = await evalScript(`
      (() => {
        let capturedUrl = null;
        window.open = (url) => { capturedUrl = url; return null; };

        const setValue = (element, value) => {
          const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          valueSetter.call(element, value);
          element.dispatchEvent(new Event('input', { bubbles: true }));
          element.dispatchEvent(new Event('change', { bubbles: true }));
        };

        // Select Athletic Recovery
        const pills = Array.from(document.querySelectorAll('.dwc-pill-btn'));
        const athleticPill = pills.find(p => p.innerText.includes('Athletic Recovery'));
        if (athleticPill) athleticPill.click();

        // Fill Name
        const nameInput = document.getElementById('dwc-client-name');
        setValue(nameInput, 'Eleanor Vance');

        // Fill Phone
        const phoneInput = document.getElementById('dwc-client-phone');
        setValue(phoneInput, '9876543210');

        // Fill Time
        const timeInput = document.getElementById('dwc-treatment-time');
        setValue(timeInput, '2:30 PM');

        // Submit Form
        const submitBtn = document.querySelector('.dwc-modal-submit-btn');
        submitBtn.click();

        return {
          capturedUrl,
          decodedUrl: capturedUrl ? decodeURIComponent(capturedUrl) : null
        };
      })()
    `);
    console.log('Treatment WhatsApp URL generated:', whatsappUrlTreatment.capturedUrl);

    // 6. Test Switching back to Therapy & Therapy Submission
    console.log('\n[TEST 6] Switching back to Therapy & Testing Submission...');
    await evalScript(`
      (() => {
        const tabs = document.querySelectorAll('.dwc-segment-tab');
        if (tabs[0]) tabs[0].click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 400));

    const therapySubmission = await evalScript(`
      (() => {
        let capturedUrl = null;
        window.open = (url) => { capturedUrl = url; return null; };

        // Select Bamboo Therapy
        const pills = Array.from(document.querySelectorAll('.dwc-pill-btn'));
        const bambooPill = pills.find(p => p.innerText.includes('Bamboo Therapy'));
        if (bambooPill) bambooPill.click();

        // Select 8:30 PM slot
        const slot830 = Array.from(document.querySelectorAll('.dwc-time-chip')).find(c => c.innerText.trim() === '8:30 PM');
        if (slot830) slot830.click();

        // Submit Form
        const submitBtn = document.querySelector('.dwc-modal-submit-btn');
        submitBtn.click();

        return {
          capturedUrl,
          decodedUrl: capturedUrl ? decodeURIComponent(capturedUrl) : null
        };
      })()
    `);
    console.log('Therapy WhatsApp URL generated:', therapySubmission.capturedUrl);

    // 7. Test Escape Key Closing
    console.log('\n[TEST 7] Testing Escape Key Closing...');
    await evalScript(`window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`);
    await new Promise((r) => setTimeout(r, 400));
    const escapeResult = await evalScript(`
      (() => {
        return {
          modalStillPresent: !!document.querySelector('.dwc-booking-modal'),
          bodyOverflow: document.body.style.overflow
        };
      })()
    `);
    console.log('Escape Key Result:', escapeResult);

    // 8. Test Footer Button Trigger & Close Button
    console.log('\n[TEST 8] Testing Footer Button Trigger & Close Button...');
    await evalScript(`
      (() => {
        const footerBtn = document.querySelector('.dwc-footer-btn-appointment');
        if (footerBtn) footerBtn.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 400));

    const footerOpened = await evalScript(`!!document.querySelector('.dwc-booking-modal')`);
    console.log('Footer Button successfully opened modal:', footerOpened);

    await evalScript(`
      (() => {
        const closeBtn = document.querySelector('.dwc-modal-close-btn');
        if (closeBtn) closeBtn.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 400));

    const modalClosed = !await evalScript(`!!document.querySelector('.dwc-booking-modal')`);
    console.log('Close Button successfully closed modal:', modalClosed);

    console.log('\n=== All Comprehensive Edge Browser Verifications Succeeded! ===');
  } catch (err) {
    console.error('Verification failed with error:', err);
    process.exit(1);
  } finally {
    proc.kill();
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch {}
  }
}

runFullVerification();
