const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = path.resolve(__dirname, '../public/audit/test_scratch');
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

async function runAudit() {
  const port = 9705;
  const userDir = path.join(scratchDir, `edge-rework-${Date.now()}`);
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDir}`,
    '--window-size=1440,900',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 3500));

  try {
    const list = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/json`, res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const pageTarget = list.find(t => t.type === 'page') || list[0];
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

    const consoleErrors = [];
    ws.addEventListener('message', evt => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Console.messageAdded' && msg.params.message.level === 'error') {
        consoleErrors.push(msg.params.message.text);
      }
    });

    await send('Runtime.enable');
    await send('Page.enable');
    await send('Console.enable');

    async function evaluate(expression) {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true });
      return res?.result?.value;
    }

    console.log('=== 1. AUDITING HOMEPAGE (HERO + ABOUT TEASER) ===');
    await evaluate(`window.location.href = 'http://localhost:5173/'`);
    await new Promise(r => setTimeout(r, 2000));

    const homeData = await evaluate(`(() => {
      const heroCanvas = document.querySelector('.cinematic-hero-canvas') || document.querySelector('.hero-cinematic');
      const aboutImg = document.querySelector('#about .founder-image');
      const teaser = document.querySelector('.about-teaser-zone');
      return {
        hasHero: !!heroCanvas,
        hasAboutTeaser: !!teaser,
        aboutImgSrc: aboutImg ? aboutImg.getAttribute('src') : null,
        aboutImgAlt: aboutImg ? aboutImg.getAttribute('alt') : null
      };
    })()`);
    console.log('Homepage verification:', homeData);

    console.log('\n=== 2. AUDITING FOUNDER PAGE AT 1440PX DESKTOP ===');
    await evaluate(`window.location.href = 'http://localhost:5173/about/founder'`);
    await new Promise(r => setTimeout(r, 2500));

    const founderData = await evaluate(`(() => {
      // Hero
      const heroImg = document.querySelector('.founder-hero-section .founder-image');

      // Education
      const eduZone = document.querySelector('.founder-education-zone');
      const eduCards = document.querySelectorAll('.education-card');
      const eduTitles = Array.from(eduCards).map(c => c.querySelector('.education-card__degree')?.innerText.trim());

      // Sports
      const sportsZone = document.querySelector('.founder-sports-zone');
      const basketballCard = document.querySelector('.sports-compact-card--basketball');
      const basketballPhoto = document.querySelector('.sports-media-group--basketball .sports-media-card--photo img');
      const basketballVideo = document.querySelector('.sports-media-group--basketball .sports-media-card--video');
      const netballCard = document.querySelector('.sports-compact-card--netball');

      // Records & Recognition
      const recordsZone = document.querySelector('.founder-records-zone');
      const record385 = document.querySelector('.record-hero-entry');
      const record385Num = record385?.querySelector('.record-column__num-hero')?.innerText.trim();
      const record210 = document.querySelector('.record-companion-entry');
      const record210Num = record210?.querySelector('.record-compact-card__num')?.innerText.trim();
      
      const recordsPhotoA = document.querySelector('.records-trophy-feature img');
      const recordsVideo02 = document.querySelector('.records-video-feature');
      
      const awardRow = document.querySelector('.records-pairing-row--award');
      const awardPhoto = awardRow?.querySelector('.records-recognition-feature img');
      const awardTitle = awardRow?.querySelector('.record-pairing-card__title')?.innerText.trim();

      const pressRow = document.querySelector('.records-pairing-row--press');
      const pressPhoto = pressRow?.querySelector('.records-press-feature img');
      const pressTitle = pressRow?.querySelector('.record-pairing-card__title')?.innerText.trim();

      const igLink = document.querySelector('.founder-instagram-link');

      // Wellness
      const wellnessZone = document.querySelector('.founder-wellness-zone');
      const wellnessItems = Array.from(document.querySelectorAll('.wellness-training-item')).map(w =>
        w.querySelector('.wellness-training-item__name')?.innerText.trim()
      );

      // Explore Modalities button check
      const exploreBtn = Array.from(document.querySelectorAll('a, button')).find(el =>
        el.innerText.toUpperCase().includes('EXPLORE MODALITIES')
      );

      const overflow = document.documentElement.scrollWidth > window.innerWidth;

      return {
        heroImgSrc: heroImg?.getAttribute('src'),
        education: {
          present: !!eduZone,
          cardCount: eduCards.length,
          degrees: eduTitles
        },
        sports: {
          present: !!sportsZone,
          hasBasketballCard: !!basketballCard,
          basketballPhotoSrc: basketballPhoto?.getAttribute('src'),
          hasBasketballVideo01: !!basketballVideo,
          hasNetballCard: !!netballCard
        },
        records: {
          present: !!recordsZone,
          record385Num,
          record210Num,
          recordsCourtPhotoSrc: recordsPhotoA?.getAttribute('src'),
          hasVideo02: !!recordsVideo02,
          hasAwardRow: !!awardRow,
          awardTitle,
          awardPhotoSrc: awardPhoto?.getAttribute('src'),
          hasPressRow: !!pressRow,
          pressTitle,
          pressPhotoSrc: pressPhoto?.getAttribute('src'),
          igHandle: igLink?.querySelector('.founder-instagram-link__handle')?.innerText.trim()
        },
        wellness: {
          present: !!wellnessZone,
          items: wellnessItems
        },
        exploreModalitiesFoundOnPage: !!exploreBtn,
        desktopOverflow: overflow,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      };
    })()`);
    console.log('Founder Page Verification:', JSON.stringify(founderData, null, 2));

    console.log('\n=== 3. TESTING VIDEO 01 MODAL ===');
    await evaluate(`window.scrollTo(0, 1100)`);
    await new Promise(r => setTimeout(r, 400));
    await evaluate(`document.querySelector('.sports-media-group--basketball .sports-media-card--video').click()`);
    await new Promise(r => setTimeout(r, 400));

    const video1Status = await evaluate(`(() => {
      const modal = document.querySelector('.founder-video-modal-backdrop');
      const title = document.querySelector('.founder-video-modal__title');
      return {
        isOpen: !!modal,
        title: title ? title.innerText : null
      };
    })()`);
    console.log('Video 01 Modal:', video1Status);

    // Close via ESC
    await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', windowsVirtualKeyCode: 27 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', windowsVirtualKeyCode: 27 });
    await new Promise(r => setTimeout(r, 400));
    console.log('Video 01 Modal Closed via ESC?', await evaluate(`!document.querySelector('.founder-video-modal-backdrop')`));

    console.log('\n=== 4. TESTING VIDEO 02 MODAL ===');
    await evaluate(`document.querySelector('.records-video-feature').click()`);
    await new Promise(r => setTimeout(r, 400));

    const video2Status = await evaluate(`(() => {
      const modal = document.querySelector('.founder-video-modal-backdrop');
      const title = document.querySelector('.founder-video-modal__title');
      return {
        isOpen: !!modal,
        title: title ? title.innerText : null
      };
    })()`);
    console.log('Video 02 Modal:', video2Status);

    // Close via Close Button
    await evaluate(`document.querySelector('.founder-video-modal__close-btn').click()`);
    await new Promise(r => setTimeout(r, 400));
    console.log('Video 02 Modal Closed via Close Button?', await evaluate(`!document.querySelector('.founder-video-modal-backdrop')`));

    console.log('\n=== 5. TESTING MOBILE VIEW (390PX) ===');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 1000));

    const mobileData = await evaluate(`(() => {
      const overflow = document.documentElement.scrollWidth > window.innerWidth;
      return {
        overflow,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      };
    })()`);
    console.log('Mobile 390px Check:', mobileData);

    console.log('\n=== 6. CONSOLE ERRORS ===');
    console.log('Console Errors:', consoleErrors.length > 0 ? consoleErrors : 'None (0 errors)');

    ws.close();
  } catch (err) {
    console.error('Audit failed:', err);
  } finally {
    proc.kill();
  }
}

runAudit();
