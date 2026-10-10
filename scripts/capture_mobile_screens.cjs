const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = path.resolve(__dirname, '../scratch_screenshots');

async function testMobile() {
  const port = 9855;
  const userDir = path.join(os.tmpdir(), `edge-mob-${Date.now()}`);
  if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDir}`,
    '--window-size=390,844',
    'http://localhost:4173/about/founder'
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
    await new Promise(r => setTimeout(r, 1000));

    // Scroll through page
    await send('Runtime.evaluate', {
      expression: `(async () => {
        for (let y = 0; y <= document.body.scrollHeight; y += 200) {
          window.scrollTo(0, y);
          window.dispatchEvent(new Event('scroll'));
          await new Promise(r => setTimeout(r, 30));
        }
      })()`,
      awaitPromise: true
    });
    await new Promise(r => setTimeout(r, 1000));

    const mobileMetrics = await send('Runtime.evaluate', {
      expression: `(() => {
        const sports = document.querySelector('.founder-sports-section');
        const press = document.querySelector('.records-press-frame');
        const pressImg = document.querySelector('.records-press-frame__img');
        const video = document.querySelector('.sports-video-feature');
        return {
          overflow: document.documentElement.scrollWidth > window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          sportsHeight: sports ? sports.offsetHeight : 0,
          pressFrameWidth: press ? press.offsetWidth : 0,
          pressFrameHeight: press ? press.offsetHeight : 0,
          pressImgRenderedWidth: pressImg ? pressImg.offsetWidth : 0,
          pressImgRenderedHeight: pressImg ? pressImg.offsetHeight : 0,
          videoOpacity: video ? window.getComputedStyle(video).opacity : null,
          videoDisplay: video ? window.getComputedStyle(video).display : null
        };
      })()`,
      returnByValue: true
    });
    console.log('MOBILE METRICS (390px):', JSON.stringify(mobileMetrics.result.value, null, 2));

    // 1. Mobile Sports
    await send('Runtime.evaluate', {
      expression: `document.querySelector('.founder-sports-section').scrollIntoView({ behavior: 'instant', block: 'start' });`
    });
    await new Promise(r => setTimeout(r, 400));
    let shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(scratchDir, 'verify_mobile_01_sports.png'), Buffer.from(shot.data, 'base64'));

    // 2. Mobile Press Image
    await send('Runtime.evaluate', {
      expression: `document.querySelector('.records-tier-press').scrollIntoView({ behavior: 'instant', block: 'center' });`
    });
    await new Promise(r => setTimeout(r, 400));
    shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(scratchDir, 'verify_mobile_02_press.png'), Buffer.from(shot.data, 'base64'));

    // 3. Mobile Transition to Vision
    await send('Runtime.evaluate', {
      expression: `document.querySelector('.founder-vision-section').scrollIntoView({ behavior: 'instant', block: 'start' });`
    });
    await new Promise(r => setTimeout(r, 400));
    shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(scratchDir, 'verify_mobile_03_vision.png'), Buffer.from(shot.data, 'base64'));

    console.log('ALL MOBILE SCREENSHOTS SAVED SUCCESSFULLY!');
    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    proc.kill();
  }
}

testMobile();
