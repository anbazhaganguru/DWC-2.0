const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function capture({ width, height, isMobile = false, outputPath }) {
  const port = 9600 + Math.floor(Math.random() * 300);
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

  try {
    let wsUrl = null;
    for (let i = 0; i < 25; i++) {
      await sleep(200);
      try {
        const list = await fetchJson(`http://127.0.0.1:${port}/json`);
        if (list && list.length > 0 && list[0].webSocketDebuggerUrl) {
          wsUrl = list[0].webSocketDebuggerUrl;
          break;
        }
      } catch (e) {}
    }

    if (!wsUrl) throw new Error('Could not get webSocketDebuggerUrl');

    const ws = new globalThis.WebSocket(wsUrl);
    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        const handler = (evt) => {
          const msg = JSON.parse(evt.data);
          if (msg.id === id) {
            ws.removeEventListener('message', handler);
            resolve(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    // Set mobile emulation if requested
    if (isMobile) {
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 2,
        mobile: true
      });
    }

    // Capture console errors
    await send('Runtime.enable');
    ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.exceptionThrown') {
        console.error('EXCEPTION ON PAGE:', JSON.stringify(msg.params.exceptionDetails, null, 2));
      }
    });

    // Wait for canvas to draw and initial GSAP entrance to complete
    await sleep(2500);

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(outputPath, Buffer.from(shot.data, 'base64'));
    console.log(`Saved screenshot to ${outputPath} (${width}x${height})`);

    ws.close();
  } finally {
    proc.kill();
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch (e) {}
  }
}

async function main() {
  const auditDir = path.resolve(__dirname, '../public/audit');
  if (!fs.existsSync(auditDir)) fs.mkdirSync(auditDir, { recursive: true });

  console.log('Capturing Desktop...');
  await capture({
    width: 1672,
    height: 941,
    isMobile: false,
    outputPath: path.join(auditDir, 'swiss_desktop.png')
  });

  console.log('Capturing Mobile...');
  await capture({
    width: 390,
    height: 844,
    isMobile: true,
    outputPath: path.join(auditDir, 'swiss_mobile.png')
  });
}

main().catch(err => {
  console.error('Capture script error:', err);
  process.exit(1);
});
