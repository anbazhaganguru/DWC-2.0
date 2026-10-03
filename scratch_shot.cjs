const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = path.resolve(__dirname, 'public/audit/test_profile_debug');

async function run() {
  const port = 9585;
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${scratchDir}_2`,
    '--window-size=1440,1080',
    'http://localhost:5173/'
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
          return new Promise(res => {
            const curId = id++;
            const handler = evt => {
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

        await send('Page.enable');

        // Scroll to therapy directory header
        await send('Runtime.evaluate', {
          expression: `
            const el = document.querySelector('.therapy-directory-header');
            if (el) el.scrollIntoView({ block: 'start' });
          `
        });

        await new Promise(r => setTimeout(r, 1200));

        const screenshot = await send('Page.captureScreenshot', {
          format: 'png'
        });

        fs.writeFileSync('public/audit/therapy_cards_visible.png', Buffer.from(screenshot.data, 'base64'));
        console.log('Saved public/audit/therapy_cards_visible.png');

        proc.kill();
        process.exit(0);
      } catch (err) {
        console.error(err);
        proc.kill();
        process.exit(1);
      }
    });
  });
}

run();
