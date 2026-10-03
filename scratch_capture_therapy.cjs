const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = path.resolve(__dirname, 'public/audit/test_scratch');
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

async function captureTherapy(width, filename) {
  const port = 9640 + Math.floor(Math.random() * 30);
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${path.join(scratchDir, 'edge-profile-therapy-' + width + '-' + Date.now())}`,
    `--window-size=${width},1000`,
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
      height: 1200,
      deviceScaleFactor: 1,
      mobile: width < 768
    });

    await send('Page.navigate', { url: 'http://localhost:5173/' });
    await new Promise(r => setTimeout(r, 2500));

    // Scroll to .therapy-directory-header
    await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('.therapy-directory-header');
        if (sec) sec.scrollIntoView({ block: 'start' });
      })()`
    });

    await new Promise(r => setTimeout(r, 800));

    // Get bounding box of directory header + cards
    const box = await send('Runtime.evaluate', {
      expression: `(() => {
        const dir = document.querySelector('.therapy-directory-header');
        const grid = document.querySelector('.therapy-grid');
        if (!dir || !grid) return null;
        const dirRect = dir.getBoundingClientRect();
        return {
          x: 0,
          y: Math.max(0, dirRect.y),
          width: width,
          height: 950
        };
      })()`,
      returnByValue: true
    });

    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: box.result.value ? { ...box.result.value, scale: 1 } : undefined
    });

    const dest = path.resolve(__dirname, 'public/audit', filename);
    fs.writeFileSync(dest, Buffer.from(shot.data, 'base64'));
    console.log(`Saved screenshot ${filename} (${fs.statSync(dest).size} bytes)`);

    ws.close();
    proc.kill();
  } catch (err) {
    console.error('Error in captureTherapy:', err);
    proc.kill();
  } finally {
    proc.kill();
  }
}

async function run() {
  await captureTherapy(1440, 'therapy_current_desktop.png');
  await captureTherapy(390, 'therapy_current_mobile.png');
  process.exit(0);
}

run();
