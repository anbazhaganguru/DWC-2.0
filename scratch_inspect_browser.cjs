const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = path.resolve(__dirname, 'public/audit/test_profile_debug');
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

async function run() {
  const port = 9580;
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${scratchDir}`,
    '--window-size=1440,1080',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  http.get(`http://127.0.0.1:${port}/json`, res => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', async () => {
      try {
        const list = JSON.parse(data);
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
        await send('DOM.enable');
        await send('CSS.enable');

        // Scroll to therapy section
        const evalResult = await send('Runtime.evaluate', {
          expression: `
            (function() {
              const el = document.querySelector('#therapy');
              if (el) el.scrollIntoView();
              return el ? 'found therapy' : 'not found';
            })()
          `
        });
        console.log('Scroll to therapy:', evalResult);

        await new Promise(r => setTimeout(r, 1000));

        // Evaluate cards inspection
        const inspect = await send('Runtime.evaluate', {
          expression: `
            (function() {
              const cards = Array.from(document.querySelectorAll('.therapy-card'));
              return cards.map((c, idx) => {
                const rect = c.getBoundingClientRect();
                const style = window.getComputedStyle(c);
                const before = window.getComputedStyle(c, '::before');
                const after = window.getComputedStyle(c, '::after');
                const header = c.querySelector('.therapy-card__header');
                const headerStyle = header ? window.getComputedStyle(header) : null;
                const headerBefore = header ? window.getComputedStyle(header, '::before') : null;
                const headerAfter = header ? window.getComputedStyle(header, '::after') : null;
                
                // Check parent column
                const col = c.parentElement;
                const colStyle = window.getComputedStyle(col);
                
                // Check grid
                const grid = col.parentElement;
                const gridStyle = window.getComputedStyle(grid);

                // Check directory header above
                const dirHeader = document.querySelector('.therapy-directory-header');
                const dirHeaderStyle = dirHeader ? window.getComputedStyle(dirHeader) : null;

                return {
                  idx,
                  className: c.className,
                  rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
                  card: {
                    borderTop: style.borderTop,
                    borderBottom: style.borderBottom,
                    boxShadow: style.boxShadow,
                    background: style.backgroundColor,
                    backgroundImage: style.backgroundImage,
                    beforeBorder: before.borderTop,
                    beforeHeight: before.height,
                    afterBorder: after.borderTop,
                    afterHeight: after.height,
                  },
                  header: headerStyle ? {
                    borderTop: headerStyle.borderTop,
                    borderBottom: headerStyle.borderBottom,
                    boxShadow: headerStyle.boxShadow,
                    beforeBorder: headerBefore.borderTop,
                    beforeHeight: headerBefore.height,
                  } : null,
                  col: {
                    gap: colStyle.gap,
                    borderTop: colStyle.borderTop
                  },
                  grid: {
                    gap: gridStyle.gap,
                    bg: gridStyle.backgroundColor,
                    borderTop: gridStyle.borderTop
                  },
                  dirHeader: dirHeaderStyle ? {
                    borderBottom: dirHeaderStyle.borderBottom,
                    rectBottom: dirHeader.getBoundingClientRect().bottom
                  } : null
                };
              });
            })()
          `,
          returnByValue: true
        });

        console.log('Inspection result:', JSON.stringify(inspect.result.value, null, 2));

        // Take a screenshot of the therapy grid
        const clipEval = await send('Runtime.evaluate', {
          expression: `
            (function() {
              const el = document.querySelector('.therapy-grid');
              const r = el.getBoundingClientRect();
              return { x: r.x, y: r.y + window.scrollY, width: r.width, height: r.height };
            })()
          `,
          returnByValue: true
        });
        console.log('Therapy grid clip:', clipEval.result.value);

        const screenshot = await send('Page.captureScreenshot', {
          clip: {
            x: 0,
            y: clipEval.result.value.y - 100,
            width: 1440,
            height: 900,
            scale: 1
          }
        });

        fs.writeFileSync('public/audit/therapy_cards_check.png', Buffer.from(screenshot.data, 'base64'));
        console.log('Saved public/audit/therapy_cards_check.png');

        proc.kill();
        process.exit(0);
      } catch (err) {
        console.error(err);
        proc.kill();
        process.exit(1);
      }
    });
  });
}

run();
