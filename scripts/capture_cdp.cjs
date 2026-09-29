const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function capture({ width, height, scrollY = 0, outputPath, url = 'http://localhost:5173/' }) {
  const port = 9333 + Math.floor(Math.random() * 500);
  const scratchDir = 'C:\\Users\\FKode solutiona\\.gemini\\antigravity-ide\\brain\\3c0328bb-9966-4a97-ae16-50cf270d20ff\\scratch';
  if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });
  const userDataDir = path.join(scratchDir, `edge-profile-${port}`);

  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    `--window-size=${width},${height}`,
    url
  ]);

  try {
    let wsUrl = null;
    for (let i = 0; i < 30; i++) {
      await sleep(200);
      try {
        const list = await fetchJson(`http://127.0.0.1:${port}/json`);
        if (list && list.length > 0 && list[0].webSocketDebuggerUrl) {
          wsUrl = list[0].webSocketDebuggerUrl;
          break;
        }
      } catch (e) {}
    }

    if (!wsUrl) throw new Error('Could not get webSocketDebuggerUrl from Edge');

    // In Node.js v22+, globalThis.WebSocket is natively available!
    const ws = new globalThis.WebSocket(wsUrl);

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        const handler = (event) => {
          const res = JSON.parse(event.data);
          if (res.id === id) {
            ws.removeEventListener('message', handler);
            resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768
    });

    // Wait for canvas to draw and initial GSAP entrance to complete
    await sleep(2500);

    if (scrollY > 0) {
      await send('Runtime.evaluate', {
        expression: `window.scrollTo(0, ${scrollY});`
      });
      await sleep(1000);
    }

    const { data } = await send('Page.captureScreenshot', {
      format: 'png'
    });

    fs.writeFileSync(outputPath, Buffer.from(data, 'base64'));
    console.log(`Saved screenshot to ${outputPath} (${width}x${height}, scrollY=${scrollY})`);

    ws.close();
  } finally {
    proc.kill();
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch (e) {}
  }
}

async function main() {
  const outDir = path.resolve(__dirname, '../public/audit');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log('Capturing Desktop Initial...');
  await capture({
    width: 1672,
    height: 941,
    scrollY: 0,
    outputPath: path.join(outDir, 'desktop_initial.png')
  });

  console.log('Capturing Mobile Initial...');
  await capture({
    width: 390,
    height: 844,
    scrollY: 0,
    outputPath: path.join(outDir, 'mobile_initial.png')
  });
}

main().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
