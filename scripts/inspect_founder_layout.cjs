const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = path.resolve(__dirname, '../public/audit/founder_inspect');

async function inspectLayout() {
  const port = 9709;
  const userDir = path.join(scratchDir, `edge-inspect-${Date.now()}`);
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDir}`,
    '--window-size=1440,1000',
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

    // Scroll to Sports & trigger GSAP
    await evaluate(`window.scrollTo(0, 1600)`);
    await new Promise(r => setTimeout(r, 800));

    let shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(scratchDir, 'sports-lower.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved sports-lower.png');

    // Also inspect computed styles of sports
    const computed = await evaluate(`(() => {
      const section = document.querySelector('.founder-sports-section');
      const zone = document.querySelector('.founder-sports-zone');
      const grid = document.querySelector('.founder-sports__grid');
      const factsCol = document.querySelector('.founder-sports__facts-col');
      const mediaCol = document.querySelector('.founder-sports__media-col');
      const netball = document.querySelector('.sports-card--netball');
      const video = document.querySelector('.sports-video-feature');
      const photo = document.querySelector('.sports-photo-feature');

      const cs = el => {
        const s = window.getComputedStyle(el);
        return {
          height: s.height,
          minHeight: s.minHeight,
          maxHeight: s.maxHeight,
          padding: s.padding,
          margin: s.margin,
          gap: s.gap
        };
      };

      return {
        section: cs(section),
        zone: cs(zone),
        grid: cs(grid),
        factsCol: cs(factsCol),
        mediaCol: cs(mediaCol),
        netball: cs(netball),
        video: cs(video),
        photo: cs(photo)
      };
    })()`);

    console.log('COMPUTED STYLES:', JSON.stringify(computed, null, 2));

    ws.close();
  } catch (e) {
    console.error('Error:', e);
  } finally {
    proc.kill();
  }
}

inspectLayout();
