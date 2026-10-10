const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = path.resolve(__dirname, '../scratch_screenshots');
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

async function verifyAll() {
  const port = 9825;
  const userDir = path.join(os.tmpdir(), `edge-verify-${Date.now()}`);
  if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDir}`,
    '--window-size=1440,1000'
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

    const pageTarget = list.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension')) || list[0];
    const ws = new globalThis.WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(method, params = {}) {
      return new Promise(res => {
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

    await send('Runtime.enable');
    await send('Page.enable');

    async function evaluate(expression) {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      return res?.result?.value;
    }

    // Navigate to /about/founder
    await send('Page.navigate', { url: 'http://localhost:4173/about/founder' });
    await new Promise(r => setTimeout(r, 2500));

    console.log('=== VERIFICATION AT 1440PX DESKTOP ===');

    // Gradually scroll to trigger all GSAP ScrollTriggers
    await evaluate(`(async () => {
      for (let y = 0; y <= document.body.scrollHeight; y += 200) {
        window.scrollTo(0, y);
        window.dispatchEvent(new Event('scroll'));
        await new Promise(r => setTimeout(r, 30));
      }
    })()`);
    await new Promise(r => setTimeout(r, 1200));

    // 1. Audit Sports section
    const sportsAudit = await evaluate(`(() => {
      const sec = document.querySelector('.founder-sports-section');
      const grid = document.querySelector('.founder-sports__grid');
      const facts = document.querySelector('.founder-sports__facts-col');
      const media = document.querySelector('.founder-sports__media-col');
      const photo = document.querySelector('.sports-photo-feature');
      const video = document.querySelector('.sports-video-feature');
      const bb = document.querySelector('.sports-card--basketball');
      const nb = document.querySelector('.sports-card--netball');
      const recSec = document.querySelector('.founder-records-section');

      const sRect = sec ? sec.getBoundingClientRect() : null;
      const vRect = video ? video.getBoundingClientRect() : null;
      const pRect = photo ? photo.getBoundingClientRect() : null;
      const nbRect = nb ? nb.getBoundingClientRect() : null;
      const recRect = recSec ? recSec.getBoundingClientRect() : null;

      return {
        sectionHeight: sec ? sec.offsetHeight : 0,
        gridHeight: grid ? grid.offsetHeight : 0,
        factsHeight: facts ? facts.offsetHeight : 0,
        mediaHeight: media ? media.offsetHeight : 0,
        hasBasketball: !!bb,
        hasNetball: !!nb,
        hasPhoto: !!photo,
        hasVideo: !!video,
        photoNaturalSize: photo ? {
          width: photo.querySelector('img')?.naturalWidth,
          height: photo.querySelector('img')?.naturalHeight
        } : null,
        videoOpacity: video ? window.getComputedStyle(video).opacity : null,
        videoDisplay: video ? window.getComputedStyle(video).display : null,
        videoVisibility: video ? window.getComputedStyle(video).visibility : null,
        videoHeight: video ? video.offsetHeight : 0,
        sportsBottom: sRect ? sRect.bottom + window.scrollY : 0,
        recordsTop: recRect ? recRect.top + window.scrollY : 0,
        gapBetweenSportsAndRecords: (recRect && sRect) ? (recRect.top - sRect.bottom) : null
      };
    })()`);
    console.log('SPORTS AUDIT:', JSON.stringify(sportsAudit, null, 2));

    // Screenshot of Sports Section
    await evaluate(`document.querySelector('.founder-sports-section').scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await new Promise(r => setTimeout(r, 500));
    let shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(scratchDir, 'verify_01_sports_desktop_top.png'), Buffer.from(shot.data, 'base64'));

    await evaluate(`window.scrollBy(0, 450)`);
    await new Promise(r => setTimeout(r, 500));
    shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(scratchDir, 'verify_01_sports_desktop_bottom.png'), Buffer.from(shot.data, 'base64'));

    // 2. Audit Records & Recognition Newspaper Image
    const pressAudit = await evaluate(`(() => {
      const tier = document.querySelector('.records-tier-press');
      const feat = document.querySelector('.records-press-feature');
      const frame = document.querySelector('.records-press-frame');
      const img = document.querySelector('.records-press-frame__img');
      const csFeat = feat ? window.getComputedStyle(feat) : null;
      const csFrame = frame ? window.getComputedStyle(frame) : null;
      const csImg = img ? window.getComputedStyle(img) : null;

      const record385 = document.querySelector('.record-num-hero')?.innerText.trim();
      const record210 = document.querySelector('.record-num-companion')?.innerText.trim();
      const trophyPhoto = document.querySelector('.records-evidence-feature__img');
      const video2 = document.querySelector('.records-video-card-feature');
      const awardPhoto = document.querySelector('.records-award-card__img');

      return {
        hasPressTier: !!tier,
        pressFeatureMaxWidth: csFeat ? csFeat.maxWidth : null,
        pressFeatureWidth: feat ? feat.offsetWidth : null,
        pressFrameWidth: frame ? frame.offsetWidth : null,
        pressFrameHeight: frame ? frame.offsetHeight : null,
        imgObjectFit: csImg ? csImg.objectFit : null,
        imgNaturalWidth: img ? img.naturalWidth : null,
        imgNaturalHeight: img ? img.naturalHeight : null,
        record385,
        record210,
        hasTrophyPhoto: !!trophyPhoto && trophyPhoto.naturalWidth > 0,
        hasVideo2: !!video2,
        hasAwardPhoto: !!awardPhoto && awardPhoto.naturalWidth > 0
      };
    })()`);
    console.log('PRESS AUDIT:', JSON.stringify(pressAudit, null, 2));

    // Screenshot of Newspaper Press Feature
    await evaluate(`document.querySelector('.records-tier-press').scrollIntoView({ behavior: 'instant', block: 'center' })`);
    await new Promise(r => setTimeout(r, 500));
    shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(scratchDir, 'verify_02_press_desktop.png'), Buffer.from(shot.data, 'base64'));

    // 3. Audit Wellness / Vision transition
    const wellnessAudit = await evaluate(`(() => {
      const wellnessSec = document.querySelector('.founder-wellness-section');
      const wellnessZone = document.querySelector('.founder-wellness-zone');
      const cards = document.querySelectorAll('.wellness-card');
      const visionSec = document.querySelector('.founder-vision-section');
      const visionZone = document.querySelector('.about-vision-zone');
      const recordsSec = document.querySelector('.founder-records-section');

      // Check text on whole page for Foot Reflexology, Taping Therapy, Cupping Therapy cards
      const bodyText = document.body.innerText;
      const hasFootReflexology = bodyText.includes('Foot Reflexology');
      const hasTapingTherapy = bodyText.includes('Taping Therapy');
      const hasCuppingTherapy = bodyText.includes('Cupping Therapy');

      const recBottom = recordsSec ? (recordsSec.getBoundingClientRect().bottom + window.scrollY) : 0;
      const visTop = visionSec ? (visionSec.getBoundingClientRect().top + window.scrollY) : 0;

      return {
        hasWellnessSection: !!wellnessSec,
        hasWellnessZone: !!wellnessZone,
        wellnessCardCount: cards.length,
        hasFootReflexologyCard: hasFootReflexology,
        hasTapingTherapyCard: hasTapingTherapy,
        hasCuppingTherapyCard: hasCuppingTherapy,
        hasVisionSection: !!visionSec,
        hasVisionZone: !!visionZone,
        gapBetweenRecordsAndVision: visTop - recBottom
      };
    })()`);
    console.log('WELLNESS / VISION AUDIT:', JSON.stringify(wellnessAudit, null, 2));

    // Screenshot of Transition between Records and Vision
    await evaluate(`document.querySelector('.founder-vision-section').scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await new Promise(r => setTimeout(r, 500));
    shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(scratchDir, 'verify_03_records_to_vision_desktop.png'), Buffer.from(shot.data, 'base64'));

    // 4. Test Video Modal 01
    console.log('\n=== TESTING VIDEO 01 MODAL ===');
    await evaluate(`document.querySelector('.sports-video-feature').click()`);
    await new Promise(r => setTimeout(r, 500));
    const modal1 = await evaluate(`(() => {
      const m = document.querySelector('.founder-video-modal-backdrop');
      const title = document.querySelector('.founder-video-modal__title')?.innerText;
      const tag = document.querySelector('.founder-video-modal__tag')?.innerText;
      const v = document.querySelector('.founder-video-modal__video');
      return {
        isOpen: !!m,
        title,
        tag,
        hasVideoTag: !!v,
        videoSrc: v ? v.getAttribute('src') : null
      };
    })()`);
    console.log('Video 01 Modal:', modal1);
    shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(scratchDir, 'verify_modal_video_01.png'), Buffer.from(shot.data, 'base64'));

    // Close Modal 01
    await evaluate(`document.querySelector('.founder-video-modal__close-btn').click()`);
    await new Promise(r => setTimeout(r, 400));
    console.log('Modal 01 Closed?', await evaluate(`!document.querySelector('.founder-video-modal-backdrop')`));

    // 5. Test Video Modal 02
    console.log('\n=== TESTING VIDEO 02 MODAL ===');
    await evaluate(`document.querySelector('.records-video-card-feature').click()`);
    await new Promise(r => setTimeout(r, 500));
    const modal2 = await evaluate(`(() => {
      const m = document.querySelector('.founder-video-modal-backdrop');
      const title = document.querySelector('.founder-video-modal__title')?.innerText;
      const tag = document.querySelector('.founder-video-modal__tag')?.innerText;
      const v = document.querySelector('.founder-video-modal__video');
      return {
        isOpen: !!m,
        title,
        tag,
        hasVideoTag: !!v,
        videoSrc: v ? v.getAttribute('src') : null
      };
    })()`);
    console.log('Video 02 Modal:', modal2);
    shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(scratchDir, 'verify_modal_video_02.png'), Buffer.from(shot.data, 'base64'));

    // Close Modal 02 via ESC
    await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', windowsVirtualKeyCode: 27 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', windowsVirtualKeyCode: 27 });
    await new Promise(r => setTimeout(r, 400));
    console.log('Modal 02 Closed via ESC?', await evaluate(`!document.querySelector('.founder-video-modal-backdrop')`));

    // 6. Test Mobile 390px
    console.log('\n=== TESTING 390PX MOBILE VIEW ===');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 1000));

    // Scroll through mobile
    await evaluate(`(async () => {
      for (let y = 0; y <= document.body.scrollHeight; y += 200) {
        window.scrollTo(0, y);
        window.dispatchEvent(new Event('scroll'));
        await new Promise(r => setTimeout(r, 30));
      }
    })()`);
    await new Promise(r => setTimeout(r, 1000));

    const mobileAudit = await evaluate(`(() => {
      const overflow = document.documentElement.scrollWidth > window.innerWidth;
      const sportsSec = document.querySelector('.founder-sports-section');
      const video = document.querySelector('.sports-video-feature');
      const photo = document.querySelector('.sports-photo-feature');
      const pressFrame = document.querySelector('.records-press-frame');

      return {
        overflow,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        sportsHeight: sportsSec ? sportsSec.offsetHeight : 0,
        videoVisible: video ? (window.getComputedStyle(video).display !== 'none' && window.getComputedStyle(video).opacity !== '0') : false,
        pressFrameWidth: pressFrame ? pressFrame.offsetWidth : 0,
        pressFrameHeight: pressFrame ? pressFrame.offsetHeight : 0
      };
    })()`);
    console.log('MOBILE AUDIT:', JSON.stringify(mobileAudit, null, 2));

    // Capture mobile sports
    await evaluate(`document.querySelector('.founder-sports-section').scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await new Promise(r => setTimeout(r, 500));
    shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(scratchDir, 'verify_mobile_01_sports.png'), Buffer.from(shot.data, 'base64'));

    // Capture mobile press
    await evaluate(`document.querySelector('.records-tier-press').scrollIntoView({ behavior: 'instant', block: 'center' })`);
    await new Promise(r => setTimeout(r, 500));
    shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(scratchDir, 'verify_mobile_02_press.png'), Buffer.from(shot.data, 'base64'));

    ws.close();
    console.log('\n=== ALL AUDITS & SCREENSHOTS COMPLETED SUCCESSFULLY ===');
  } catch (err) {
    console.error('Audit error:', err);
  } finally {
    proc.kill();
  }
}

verifyAll();
