const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const auditDir = path.resolve(__dirname, '../public/audit');
if (!fs.existsSync(auditDir)) fs.mkdirSync(auditDir, { recursive: true });

function captureScroll() {
  return new Promise((resolve, reject) => {
    const port = 9585;
    const userDataDir = path.resolve(__dirname, `../tools/edge-profile-${port}`);
    if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

    const proc = spawn(edgePath, [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      `--remote-debugging-port=${port}`,
      '--remote-debugging-address=127.0.0.1',
      `--user-data-dir=${userDataDir}`,
      '--window-size=1672,941',
      'http://localhost:5173/'
    ]);

    setTimeout(() => {
      http.get(`http://127.0.0.1:${port}/json`, (res) => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', async () => {
          try {
            const list = JSON.parse(d);
            const pageTarget = list.find(t => t.type === 'page') || list[0];
            const ws = new globalThis.WebSocket(pageTarget.webSocketDebuggerUrl);
            ws.onopen = async () => {
              let id = 1;
              function send(method, params = {}) {
                return new Promise(r => {
                  const curId = id++;
                  const handler = evt => {
                    const msg = JSON.parse(evt.data);
                    if (msg.id === curId) {
                      ws.removeEventListener('message', handler);
                      r(msg.result);
                    }
                  };
                  ws.addEventListener('message', handler);
                  ws.send(JSON.stringify({ id: curId, method, params }));
                });
              }

              // Allow React to mount and initial entrance animation to complete
              await new Promise(r => setTimeout(r, 2200));

              // Frame at scroll = 0
              const shot0 = await send('Page.captureScreenshot', { format: 'png' });
              fs.writeFileSync(path.join(auditDir, 'scroll_000.png'), Buffer.from(shot0.data, 'base64'));
              console.log('Saved scroll_000.png');

              // Scroll to 500px (chair rotates ~25%)
              await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 500);' });
              await new Promise(r => setTimeout(r, 600));
              const shot1 = await send('Page.captureScreenshot', { format: 'png' });
              fs.writeFileSync(path.join(auditDir, 'scroll_500.png'), Buffer.from(shot1.data, 'base64'));
              console.log('Saved scroll_500.png');

              // Scroll to 1000px (chair rotates ~50%)
              await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 1000);' });
              await new Promise(r => setTimeout(r, 600));
              const shot2 = await send('Page.captureScreenshot', { format: 'png' });
              fs.writeFileSync(path.join(auditDir, 'scroll_1000.png'), Buffer.from(shot2.data, 'base64'));
              console.log('Saved scroll_1000.png');

              // Scroll to 1500px (chair rotates ~75%)
              await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 1500);' });
              await new Promise(r => setTimeout(r, 600));
              const shot3 = await send('Page.captureScreenshot', { format: 'png' });
              fs.writeFileSync(path.join(auditDir, 'scroll_1500.png'), Buffer.from(shot3.data, 'base64'));
              console.log('Saved scroll_1500.png');

              ws.close();
              proc.kill();
              resolve();
            };
          } catch (err) {
            proc.kill();
            reject(err);
          }
        });
      }).on('error', err => {
        proc.kill();
        reject(err);
      });
    }, 2500);
  });
}

captureScroll().then(() => {
  console.log('All scroll steps captured successfully!');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
