const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchProfileDir = 'C:\\Users\\FKode solutiona\\.gemini\\antigravity-ide\\brain\\eb6ac8a6-0d6e-4d10-818a-1bd19c0129f0\\scratch\\edge_viewports_profile_mobile';
const screenshotDir = path.resolve(__dirname, '../scratch_screenshots');

async function testMobile() {
  const port = 9615;
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${scratchProfileDir}`,
    '--window-size=390,844',
    'http://localhost:5173/DWC-2.0/'
  ]);

  await new Promise(r => setTimeout(r, 2500));

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
          return new Promise(resSend => {
            const curId = id++;
            const handler = evt => {
              try {
                const msg = JSON.parse(evt.data);
                if (msg.id === curId) {
                  ws.removeEventListener('message', handler);
                  resSend(msg.result);
                }
              } catch (_) {}
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({ id: curId, method, params }));
          });
        }

        await send('Page.enable');

        // Check rect before scroll
        const initialInfo = await send('Runtime.evaluate', {
          expression: `
            (() => {
              const el = document.querySelector('#reviews');
              const rect = el ? el.getBoundingClientRect() : null;
              return { rect, scrollY: window.scrollY };
            })()
          `,
          returnByValue: true
        });
        console.log('Initial info:', initialInfo.result.value);

        // Scroll so #reviews is in view
        await send('Runtime.evaluate', {
          expression: `
            (() => {
              const el = document.querySelector('#reviews');
              if (el) {
                const docTop = window.scrollY + el.getBoundingClientRect().top;
                window.scrollTo({ top: docTop, behavior: 'instant' });
              }
            })()
          `
        });

        console.log('Scrolled to #reviews, waiting for Zyff...');
        await new Promise(r => setTimeout(r, 4500));

        const scrollInfo = await send('Runtime.evaluate', {
          expression: `
            (() => {
              const el = document.querySelector('#reviews');
              const rect = el ? el.getBoundingClientRect() : null;
              const container = document.querySelector('.zyff-google-reviews');
              const root = container?.querySelector('[data-zyff-root]');
              const shadow = root?.shadowRoot;
              const articles = shadow?.querySelectorAll('article')?.length || 0;
              const hasOverflow = document.documentElement.scrollWidth > window.innerWidth;
              return {
                rect,
                scrollY: window.scrollY,
                state: container?.getAttribute('data-zyff-state'),
                hasShadow: !!shadow,
                articles,
                hasOverflow,
                scrollWidth: document.documentElement.scrollWidth,
                innerWidth: window.innerWidth
              };
            })()
          `,
          returnByValue: true
        });
        console.log('Scroll info:', scrollInfo.result.value);

        const shot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(screenshotDir, 'reviews_mobile_390.png'), Buffer.from(shot.data, 'base64'));
        console.log('Saved reviews_mobile_390.png');

        proc.kill();
        process.exit(0);
      } catch (e) {
        console.error(e);
        proc.kill();
        process.exit(1);
      }
    });
  });
}

testMobile();
