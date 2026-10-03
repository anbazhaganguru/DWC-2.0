const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const auditDir = path.resolve(__dirname, '../public/audit');
if (!fs.existsSync(auditDir)) fs.mkdirSync(auditDir, { recursive: true });

async function debugTherapyAndVideo() {
  console.log('=== Checking Live DOM for Therapy and Video ===');
  const port = 9662;
  const userDataDir = path.join(auditDir, 'test_profile_debug_' + Date.now());

  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--window-size=1440,1000',
    'http://localhost:5173/'
  ]);

  proc.stderr.on('data', (d) => console.error('Edge stderr:', d.toString()));

  await new Promise((r) => setTimeout(r, 3000));

  try {
    const list = await new Promise((resolve, reject) => {
      const req = http.get(`http://127.0.0.1:${port}/json`, (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      });
      req.on('error', reject);
    });

    console.log('Targets:', list.map(t => ({ title: t.title, url: t.url, type: t.type })));
    const pageTarget = list.find((t) => t.type === 'page') || list[0];
    if (!pageTarget) {
      throw new Error('No page target found');
    }

    const ws = new globalThis.WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const curId = id++;
        const timer = setTimeout(() => reject(new Error('Timeout on ' + method)), 10000);
        const handler = (evt) => {
          try {
            const msg = JSON.parse(evt.data);
            if (msg.id === curId) {
              clearTimeout(timer);
              ws.removeEventListener('message', handler);
              if (msg.error) {
                reject(new Error(msg.error.message));
              } else {
                resolve(msg.result);
              }
            }
          } catch (e) {
            clearTimeout(timer);
            reject(e);
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
      return res.result?.value;
    }

    // Wait a moment for React hydration / render
    await new Promise((r) => setTimeout(r, 2000));

    const pageTitle = await evalScript('document.title');
    console.log('Page Title:', pageTitle);

    // Therapy Cards DOM & Styles
    const therapyCardsInfo = await evalScript(`(() => {
      const cards = document.querySelectorAll('.therapy-card');
      return Array.from(cards).map(card => {
        const numUnit = card.querySelector('.therapy-card-number, .therapy-card__number-unit');
        const numVal = card.querySelector('.therapy-card-number-value, .therapy-card__watermark');
        const numLine = card.querySelector('.therapy-card-number-line, .therapy-card__accent-line');
        const cardStyle = window.getComputedStyle(card);
        const lineStyle = numLine ? window.getComputedStyle(numLine) : null;
        const lineRect = numLine ? numLine.getBoundingClientRect() : null;
        const valRect = numVal ? numVal.getBoundingClientRect() : null;

        return {
          classes: card.className,
          numValText: numVal ? numVal.innerText : null,
          hasLine: !!numLine,
          lineComputed: lineStyle ? {
            display: lineStyle.display,
            visibility: lineStyle.visibility,
            opacity: lineStyle.opacity,
            width: lineStyle.width,
            height: lineStyle.height,
            backgroundColor: lineStyle.backgroundColor,
            position: lineStyle.position,
            zIndex: lineStyle.zIndex,
            overflow: lineStyle.overflow
          } : null,
          lineRect: lineRect ? {
            top: lineRect.top,
            left: lineRect.left,
            width: lineRect.width,
            height: lineRect.height
          } : null,
          valRect: valRect ? {
            top: valRect.top,
            left: valRect.left,
            width: valRect.width,
            height: valRect.height
          } : null
        };
      });
    })()`);

    console.log('THERAPY CARDS DOM & STYLES:');
    console.log(JSON.stringify(therapyCardsInfo, null, 2));

    // Test all 7 pages for video section
    const testUrls = [
      '/services/irobo-massage-chair',
      '/therapy/reflexology',
      '/therapy/taping',
      '/therapy/ice-bath',
      '/therapy/steam-bath',
      '/therapy/cupping',
      '/therapy/bamboo'
    ];

    console.log('\n--- CHECKING 7 DEDICATED SERVICE PAGES FOR VIDEO SECTION ---');
    for (const urlPath of testUrls) {
      await send('Page.navigate', { url: `http://localhost:5173${urlPath}` });
      await new Promise((r) => setTimeout(r, 1500));

      const pageCheck = await evalScript(`(() => {
        const videoSection = document.querySelector('#service-video, .service-video');
        const placeholder = document.querySelector('.service-video__placeholder-box');
        const playerBox = document.querySelector('.service-video__player-box');
        const iframe = document.querySelector('.service-video__iframe');
        const vHeading = document.querySelector('#video-heading')?.innerText;
        const vStyle = videoSection ? window.getComputedStyle(videoSection) : null;
        const vRect = videoSection ? videoSection.getBoundingClientRect() : null;
        const main = document.querySelector('.service-detail-main');
        const children = main ? Array.from(main.children).map(c => c.className || c.tagName) : [];

        return {
          title: document.title,
          hasVideoSection: !!videoSection,
          hasPlaceholder: !!placeholder,
          hasPlayerBox: !!playerBox,
          hasIframe: !!iframe,
          heading: vHeading,
          order: children,
          rect: vRect ? { top: vRect.top, height: vRect.height } : null,
          display: vStyle?.display,
          visibility: vStyle?.visibility
        };
      })()`);

      console.log(`PAGE: ${urlPath}`, JSON.stringify(pageCheck, null, 2));
    }

    ws.close();
  } catch (err) {
    console.error('Debug script failed with error:', err);
  } finally {
    proc.kill();
  }
}

debugTherapyAndVideo();
