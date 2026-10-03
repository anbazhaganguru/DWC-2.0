const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = path.resolve(__dirname, '../public/audit/test_scratch');
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

const viewports = [320, 360, 375, 390, 430, 768, 1440];

async function testViewport(width) {
  const port = 9560 + Math.floor(Math.random() * 30);
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${path.join(scratchDir, 'edge-profile-' + width)}`,
    `--window-size=${width},900`,
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  return new Promise((resolve, reject) => {
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

          // Set viewport via Emulation
          await send('Emulation.setDeviceMetricsOverride', {
            width: width,
            height: 900,
            deviceScaleFactor: 1,
            mobile: width < 1024
          });

          await new Promise(r => setTimeout(r, 1500));

          const evalRes = await send('Runtime.evaluate', {
            expression: `
              (() => {
                const therapy = document.querySelector('#therapy');
                if (!therapy) return { error: 'Therapy section not found' };

                const docScrollW = document.documentElement.scrollWidth;
                const docClientW = document.documentElement.clientWidth;
                const winInnerW = window.innerWidth;
                const therapyScrollW = therapy.scrollWidth;
                const therapyClientW = therapy.clientWidth;

                const overflows = [];
                const allEls = therapy.querySelectorAll('*');
                allEls.forEach(el => {
                  const rect = el.getBoundingClientRect();
                  if (rect.right > winInnerW + 0.5) {
                    overflows.push({
                      tag: el.tagName.toLowerCase(),
                      className: el.className,
                      right: rect.right,
                      width: rect.width,
                      overflowBy: rect.right - winInnerW
                    });
                  }
                });

                const cards = Array.from(therapy.querySelectorAll('.therapy-card')).map(c => {
                  const r = c.getBoundingClientRect();
                  const imgBox = c.querySelector('.therapy-card__img-box');
                  const imgR = imgBox ? imgBox.getBoundingClientRect() : null;
                  return {
                    class: c.className,
                    cardWidth: r.width,
                    cardRight: r.right,
                    imgBoxWidth: imgR ? imgR.width : null,
                    imgBoxRight: imgR ? imgR.right : null
                  };
                });

                return {
                  viewportWidth: winInnerW,
                  docScrollW,
                  docClientW,
                  therapyScrollW,
                  therapyClientW,
                  hasDocOverflow: docScrollW > docClientW,
                  overflowCount: overflows.length,
                  overflows: overflows.slice(0, 10),
                  cards
                };
              })()
            `,
            returnByValue: true
          });

          ws.close();
          proc.kill();
          resolve(evalRes.result.value);
        } catch (e) {
          proc.kill();
          reject(e);
        }
      });
    }).on('error', err => {
      proc.kill();
      reject(err);
    });
  });
}

async function run() {
  console.log('Testing therapy overflow across viewports...');
  for (const w of viewports) {
    try {
      const res = await testViewport(w);
      console.log(`\n=== Viewport: ${w}px ===`);
      console.log(`docScrollW: ${res.docScrollW}, docClientW: ${res.docClientW}, therapyScrollW: ${res.therapyScrollW}`);
      console.log(`Overflow elements: ${res.overflowCount}`);
      if (res.overflowCount > 0) {
        console.log('Top overflowing elements:', JSON.stringify(res.overflows, null, 2));
      }
      if (res.cards && res.cards.length > 0) {
        console.log(`First card width: ${res.cards[0].cardWidth}px, right: ${res.cards[0].cardRight}px`);
        if (res.cards[0].imgBoxWidth) {
          console.log(`First card img-box width: ${res.cards[0].imgBoxWidth}px, right: ${res.cards[0].imgBoxRight}px`);
        }
      }
    } catch (e) {
      console.error(`Error at ${w}px:`, e.message);
    }
  }
}

run();
