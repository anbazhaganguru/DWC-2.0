const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = path.resolve(__dirname, '../public/audit/test_scratch');
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

async function capture(width, filename) {
  const port = 9630 + Math.floor(Math.random() * 20);
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${path.join(scratchDir, 'edge-profile-shot-' + width)}`,
    `--window-size=${width},900`,
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2000));

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
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 1250,
      deviceScaleFactor: 1,
      mobile: width < 768
    });

    await send('Page.navigate', { url: 'http://localhost:5173/' });
    await new Promise(r => setTimeout(r, 2500));

    // Scroll to #recovery
    await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('#recovery');
        if (sec) sec.scrollIntoView({ block: 'start' });
      })()`
    });

    await new Promise(r => setTimeout(r, 800));

    const box = await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('#recovery');
        if (!sec) return null;
        const r = sec.getBoundingClientRect();
        return { x: 0, y: Math.max(0, r.y), width: width, height: Math.min(950, r.height) };
      })()`,
      returnByValue: true
    });

    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: box.result.value ? { ...box.result.value, scale: 1 } : undefined
    });

    const dest = path.resolve(__dirname, '../public/audit', filename);
    fs.writeFileSync(dest, Buffer.from(shot.data, 'base64'));
    console.log(`Saved screenshot ${filename} (${fs.statSync(dest).size} bytes)`);

    ws.close();
    proc.kill();
  } finally {
    proc.kill();
  }
}

async function run() {
  await capture(1440, 'recovery_desktop_audit.png');
  await capture(390, 'recovery_mobile_audit.png');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
