const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const auditDir = path.resolve(__dirname, '../public/audit');
if (!fs.existsSync(auditDir)) fs.mkdirSync(auditDir, { recursive: true });

function captureOne(width, height, isMobile, filename) {
  return new Promise((resolve, reject) => {
    const port = 9572 + (isMobile ? 1 : 0);
    const userDataDir = path.resolve(__dirname, `../tools/edge-profile-${port}`);
    if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

    const proc = spawn(edgePath, [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      `--remote-debugging-port=${port}`,
      '--remote-debugging-address=127.0.0.1',
      `--user-data-dir=${userDataDir}`,
      `--window-size=${width},${height}`,
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

              // Allow React to mount, sequence frame to draw, and entrance anim to finish
              await new Promise(r => setTimeout(r, 2500));

              const shot = await send('Page.captureScreenshot', { format: 'png' });
              const outPath = path.join(auditDir, filename);
              fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
              console.log(`Saved screenshot ${filename}: ${fs.statSync(outPath).size} bytes`);

              ws.close();
              proc.kill();
              resolve(outPath);
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

async function main() {
  console.log('Capturing Desktop...');
  await captureOne(1672, 941, false, 'swiss_desktop.png');
  await new Promise(r => setTimeout(r, 1000));
  console.log('Capturing Mobile...');
  await captureOne(390, 844, true, 'swiss_mobile.png');
  console.log('Complete!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
