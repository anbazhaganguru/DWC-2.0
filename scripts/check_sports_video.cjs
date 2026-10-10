const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = path.resolve(__dirname, '../public/audit/founder_inspect');

async function testVideo() {
  const port = 9713;
  const userDir = path.join(scratchDir, `edge-inspect-${Date.now()}`);
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDir}`,
    '--window-size=1440,1200',
    'http://localhost:5173/about/founder'
  ]);

  await new Promise(r => setTimeout(r, 2500));

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
        const handler = (evt) => {
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

    await send('Runtime.enable');
    await send('Page.enable');

    async function evaluate(expression) {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true });
      return res?.result?.value;
    }

    // Smooth scroll down by sending mouse wheel events
    await evaluate(`(async () => {
      for (let i = 0; i < 20; i++) {
        window.scrollBy(0, 100);
        await new Promise(r => setTimeout(r, 50));
      }
    })()`);
    await new Promise(r => setTimeout(r, 2000));

    const shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(scratchDir, 'sports-wheel-scroll.png'), Buffer.from(shot.data, 'base64'));

    const vState = await evaluate(`(() => {
      const v = document.querySelector('.sports-video-feature');
      return {
        opacity: window.getComputedStyle(v).opacity,
        rect: v.getBoundingClientRect()
      };
    })()`);
    console.log('Video state after wheel scroll:', vState);

    ws.close();
  } catch (e) {
    console.error(e);
  } finally {
    proc.kill();
  }
}

testVideo();
