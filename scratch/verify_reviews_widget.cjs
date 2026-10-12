const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchProfileDir = 'C:\\Users\\FKode solutiona\\.gemini\\antigravity-ide\\brain\\eb6ac8a6-0d6e-4d10-818a-1bd19c0129f0\\scratch\\edge_reviews_profile';
const screenshotDir = path.resolve(__dirname, '../scratch_screenshots');

if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

async function runAudit() {
  const port = 9598;
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${scratchProfileDir}`,
    '--window-size=1440,1080',
    'http://localhost:5173/DWC-2.0/'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  http.get(`http://127.0.0.1:${port}/json`, res => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', async () => {
      try {
        const list = JSON.parse(data);
        const pageTarget = list.find(t => t.type === 'page') || list[0];
        const ws = new globalThis.WebSocket(pageTarget.webSocketDebuggerUrl);
        await new Promise(r => ws.onopen = r);

        let id = 1;
        function send(method, params = {}) {
          return new Promise(res => {
            const curId = id++;
            const handler = evt => {
              try {
                const msg = JSON.parse(evt.data);
                if (msg.id === curId) {
                  ws.removeEventListener('message', handler);
                  res(msg.result);
                }
              } catch (_) {}
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({ id: curId, method, params }));
          });
        }

        await send('Page.enable');

        // Scroll to #reviews section
        await send('Runtime.evaluate', {
          expression: `
            const el = document.querySelector('#reviews');
            if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
          `
        });

        console.log('Scrolled to #reviews, waiting for Zyff widget to fetch and render...');
        await new Promise(r => setTimeout(r, 4000));

        // Evaluate Desktop
        const evalDesktop = await send('Runtime.evaluate', {
          expression: `
            (() => {
              const section = document.querySelector('#reviews');
              const container = document.querySelector('.zyff-google-reviews');
              const state = container?.getAttribute('data-zyff-state');
              const root = container?.querySelector('[data-zyff-root]');
              const shadow = root?.shadowRoot;
              const attribution = !!container?.querySelector('[data-zyff-attribution]');
              
              const reviewsFound = [];
              if (shadow) {
                const articles = shadow.querySelectorAll('article');
                articles.forEach(art => {
                  const author = art.querySelector('header span, header a')?.textContent || '';
                  const text = art.querySelector('p')?.textContent || '';
                  reviewsFound.push({ author: author.trim(), text: text.trim().slice(0, 80) });
                });
              }

              return {
                sectionPresent: !!section,
                containerPresent: !!container,
                state,
                hasShadow: !!shadow,
                attribution,
                articlesCount: reviewsFound.length,
                reviewsFound,
                hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
                viewportWidth: window.innerWidth
              };
            })()
          `,
          returnByValue: true
        });

        console.log('--- Desktop (1440px) Evaluation ---');
        console.log(JSON.stringify(evalDesktop.result?.value, null, 2));

        const shotDesktop = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(screenshotDir, 'reviews_desktop_1440.png'), Buffer.from(shotDesktop.data, 'base64'));
        console.log('Saved reviews_desktop_1440.png');

        // Tablet
        await send('Emulation.setDeviceMetricsOverride', {
          width: 768,
          height: 1024,
          deviceScaleFactor: 2,
          mobile: false
        });
        await send('Runtime.evaluate', {
          expression: `
            const el = document.querySelector('#reviews');
            if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
          `
        });
        await new Promise(r => setTimeout(r, 1000));

        const evalTablet = await send('Runtime.evaluate', {
          expression: `
            (() => ({
              viewportWidth: window.innerWidth,
              hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
              scrollWidth: document.documentElement.scrollWidth
            }))()
          `,
          returnByValue: true
        });
        console.log('Tablet Evaluation:', evalTablet.result?.value);

        const shotTablet = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(screenshotDir, 'reviews_tablet_768.png'), Buffer.from(shotTablet.data, 'base64'));
        console.log('Saved reviews_tablet_768.png');

        // Mobile (390px)
        await send('Emulation.setDeviceMetricsOverride', {
          width: 390,
          height: 844,
          deviceScaleFactor: 3,
          mobile: true
        });
        await send('Runtime.evaluate', {
          expression: `
            const el = document.querySelector('#reviews');
            if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
          `
        });
        await new Promise(r => setTimeout(r, 1000));

        const evalMobile = await send('Runtime.evaluate', {
          expression: `
            (() => {
              const card = document.querySelector('.zyff-google-reviews [data-zyff-root]')?.shadowRoot?.querySelector('article');
              return {
                viewportWidth: window.innerWidth,
                hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
                scrollWidth: document.documentElement.scrollWidth,
                cardWidth: card?.getBoundingClientRect().width
              };
            })()
          `,
          returnByValue: true
        });
        console.log('Mobile Evaluation:', evalMobile.result?.value);

        const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(screenshotDir, 'reviews_mobile_390.png'), Buffer.from(shotMobile.data, 'base64'));
        console.log('Saved reviews_mobile_390.png');

        proc.kill();
        process.exit(0);
      } catch (err) {
        console.error('Audit Error:', err);
        proc.kill();
        process.exit(1);
      }
    });
  });
}

runAudit();
