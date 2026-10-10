const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const os = require('os');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = path.resolve(__dirname, '../scratch_screenshots');
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

async function runAudit() {
  const port = 9720;
  const userDir = path.join(os.tmpdir(), `edge-audit-${Date.now()}`);
  if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDir}`,
    '--window-size=1440,1000',
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

    // Wait for initial render
    await new Promise(r => setTimeout(r, 1000));

    // Scroll gradually through page so GSAP triggers run
    await evaluate(`(async () => {
      for (let i = 0; i < 30; i++) {
        window.scrollBy(0, 300);
        await new Promise(r => setTimeout(r, 50));
      }
    })()`);
    await new Promise(r => setTimeout(r, 1000));

    // Inspect layout of Sports, Records, Wellness
    const layout = await evaluate(`(() => {
      const el = sel => document.querySelector(sel);
      const rect = sel => {
        const node = el(sel);
        if (!node) return null;
        const r = node.getBoundingClientRect();
        const s = window.getComputedStyle(node);
        return {
          top: r.top + window.scrollY,
          bottom: r.bottom + window.scrollY,
          height: r.height,
          computedHeight: s.height,
          minHeight: s.minHeight,
          maxHeight: s.maxHeight,
          margin: s.margin,
          padding: s.padding,
          display: s.display,
          gridTemplateColumns: s.gridTemplateColumns,
          alignItems: s.alignItems
        };
      };

      return {
        sportsSection: rect('.founder-sports-section'),
        sportsZone: rect('.founder-sports-zone'),
        sportsGrid: rect('.founder-sports__grid'),
        sportsFactsCol: rect('.founder-sports__facts-col'),
        sportsMediaCol: rect('.founder-sports__media-col'),
        sportsPhotoFeature: rect('.sports-photo-feature'),
        sportsPhotoFrame: rect('.sports-photo-feature__frame'),
        sportsVideoFeature: rect('.sports-video-feature'),
        sportsNetball: rect('.sports-card--netball'),
        recordsSection: rect('.founder-records-section'),
        recordsZone: rect('.founder-records-zone'),
        recordsPrimary: rect('.records-tier-primary'),
        recordsSecondary: rect('.records-tier-secondary'),
        recordsPress: rect('.records-tier-press'),
        recordsPressFeature: rect('.records-press-feature'),
        recordsPressFrame: rect('.records-press-frame'),
        recordsPressImg: rect('.records-press-frame__img'),
        wellnessSection: rect('.founder-wellness-section'),
        wellnessZone: rect('.founder-wellness-zone'),
        wellnessGrid: rect('.founder-wellness__grid'),
        visionSection: rect('.founder-vision-section')
      };
    })()`);

    console.log('LAYOUT INSPECTION:\n', JSON.stringify(layout, null, 2));

    // Take screenshots of the sections
    // 1. Sports top
    await evaluate(`window.scrollTo(0, 1160)`);
    await new Promise(r => setTimeout(r, 600));
    let shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(scratchDir, 'target_01_sports_top.png'), Buffer.from(shot.data, 'base64'));

    // 1b. Sports middle
    await evaluate(`window.scrollTo(0, 1500)`);
    await new Promise(r => setTimeout(r, 600));
    shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(scratchDir, 'target_01_sports_mid.png'), Buffer.from(shot.data, 'base64'));

    // 1c. Sports bottom
    await evaluate(`window.scrollTo(0, 1850)`);
    await new Promise(r => setTimeout(r, 600));
    shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(scratchDir, 'target_01_sports_bottom.png'), Buffer.from(shot.data, 'base64'));

    // 2. Records Press
    await evaluate(`window.scrollTo(0, 3550)`);
    await new Promise(r => setTimeout(r, 600));
    shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(scratchDir, 'target_02_press_desktop.png'), Buffer.from(shot.data, 'base64'));

    // 3. Wellness
    await evaluate(`window.scrollTo(0, 4480)`);
    await new Promise(r => setTimeout(r, 600));
    shot = await send('Page.captureScreenshot');
    fs.writeFileSync(path.join(scratchDir, 'target_03_wellness_desktop.png'), Buffer.from(shot.data, 'base64'));

    console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
    ws.close();
  } catch (err) {
    console.error('Audit error:', err);
  } finally {
    proc.kill();
  }
}

runAudit();
