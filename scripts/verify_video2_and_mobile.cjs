const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = path.resolve(__dirname, '../scratch_screenshots');

async function testMobileAndVideo2() {
  const port = 9831;
  const userDir = path.join(os.tmpdir(), `edge-v2m-${Date.now()}`);
  if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDir}`,
    '--window-size=1440,1000'
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

    const pageTarget = list.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension')) || list[0];
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
      const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      return res?.result?.value;
    }

    await send('Page.navigate', { url: 'http://localhost:4173/about/founder' });
    await new Promise(r => setTimeout(r, 2000));

    // Scroll down to Records section
    await evaluate(`document.querySelector('.records-video-card-feature').scrollIntoView({ behavior: 'instant', block: 'center' })`);
    await new Promise(r => setTimeout(r, 500));

    // Click Video 02
    await evaluate(`document.querySelector('.records-video-card-feature').click()`);
    await new Promise(r => setTimeout(r, 600));

    let shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(scratchDir, 'verify_modal_video_02.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved verify_modal_video_02.png');

    // Close Video 02 via close button
    await evaluate(`document.querySelector('.founder-video-modal__close-btn').click()`);
    await new Promise(r => setTimeout(r, 400));
    console.log('Video 02 closed?', await evaluate(`!document.querySelector('.founder-video-modal-backdrop')`));

    // Now test 390px mobile view
    console.log('Testing 390px mobile...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 600));

    // Scroll to sports
    await evaluate(`document.querySelector('.founder-sports-section').scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await new Promise(r => setTimeout(r, 500));
    shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(scratchDir, 'verify_mobile_01_sports.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved verify_mobile_01_sports.png');

    // Scroll to press
    await evaluate(`document.querySelector('.records-tier-press').scrollIntoView({ behavior: 'instant', block: 'center' })`);
    await new Promise(r => setTimeout(r, 500));
    shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(scratchDir, 'verify_mobile_02_press.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved verify_mobile_02_press.png');

    // Scroll to vision
    await evaluate(`document.querySelector('.founder-vision-section').scrollIntoView({ behavior: 'instant', block: 'start' })`);
    await new Promise(r => setTimeout(r, 500));
    shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(scratchDir, 'verify_mobile_03_vision.png'), Buffer.from(shot.data, 'base64'));
    console.log('Saved verify_mobile_03_vision.png');

    const mobileCheck = await evaluate(`(() => {
      return {
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      };
    })()`);
    console.log('Mobile Check:', mobileCheck);

    ws.close();
  } catch (e) {
    console.error(e);
  } finally {
    proc.kill();
  }
}
testMobileAndVideo2();
