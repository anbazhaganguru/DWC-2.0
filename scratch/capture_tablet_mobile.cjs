const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchProfileDir = 'C:\\Users\\FKode solutiona\\.gemini\\antigravity-ide\\brain\\eb6ac8a6-0d6e-4d10-818a-1bd19c0129f0\\scratch\\edge_viewports_profile';
const screenshotDir = path.resolve(__dirname, '../scratch_screenshots');

async function captureViewport(width, height, isMobile, filename) {
  const port = 9605;
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${scratchProfileDir}_${width}`,
    `--window-size=${width},${height}`,
    'http://localhost:5173/DWC-2.0/'
  ]);

  await new Promise(r => setTimeout(r, 2200));

  return new Promise((resolve, reject) => {
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
          if (isMobile) {
            await send('Emulation.setDeviceMetricsOverride', {
              width,
              height,
              deviceScaleFactor: 2,
              mobile: true
            });
          }

          await send('Runtime.evaluate', {
            expression: `
              const el = document.querySelector('#reviews');
              if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
            `
          });

          await new Promise(r => setTimeout(r, 3800));

          const metrics = await send('Runtime.evaluate', {
            expression: `
              (() => ({
                scrollWidth: document.documentElement.scrollWidth,
                innerWidth: window.innerWidth,
                hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
                state: document.querySelector('.zyff-google-reviews')?.getAttribute('data-zyff-state')
              }))()
            `,
            returnByValue: true
          });

          console.log(`[${filename}] Metrics:`, metrics.result?.value);

          const shot = await send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync(path.join(screenshotDir, filename), Buffer.from(shot.data, 'base64'));
          console.log(`Saved ${filename}`);

          ws.close();
          proc.kill();
          resolve();
        } catch (err) {
          proc.kill();
          reject(err);
        }
      });
    });
  });
}

async function run() {
  console.log('Capturing Tablet (768x1024)...');
  await captureViewport(768, 1024, false, 'reviews_tablet_768.png');

  console.log('Capturing Mobile (390x844)...');
  await captureViewport(390, 844, true, 'reviews_mobile_390.png');

  process.exit(0);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
