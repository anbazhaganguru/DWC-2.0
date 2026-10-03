const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = path.resolve(__dirname, 'public/audit/test_scratch');
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

async function inspectDOM() {
  const port = 9675;
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${path.join(scratchDir, 'edge-profile-inspect-dom')}`,
    '--window-size=1440,1000',
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
    await new Promise(r => setTimeout(r, 2000));

    const evalResult = await send('Runtime.evaluate', {
      expression: `(() => {
        function getStyles(sel) {
          const el = document.querySelector(sel);
          if (!el) return { found: false };
          const cs = window.getComputedStyle(el);
          const before = window.getComputedStyle(el, '::before');
          const after = window.getComputedStyle(el, '::after');
          return {
            found: true,
            tagName: el.tagName,
            rect: el.getBoundingClientRect(),
            border: cs.border,
            borderTop: cs.borderTop,
            borderBottom: cs.borderBottom,
            borderLeft: cs.borderLeft,
            borderRight: cs.borderRight,
            boxShadow: cs.boxShadow,
            outline: cs.outline,
            backgroundColor: cs.backgroundColor,
            textDecoration: cs.textDecoration,
            beforeContent: before.content,
            beforeBorder: before.border,
            beforeBorderTop: before.borderTop,
            beforeHeight: before.height,
            afterContent: after.content,
            afterBorder: after.border,
            afterBorderTop: after.borderTop,
            afterHeight: after.height
          };
        }

        const cards = Array.from(document.querySelectorAll('.therapy-card')).map((c, i) => {
          const cs = window.getComputedStyle(c);
          const before = window.getComputedStyle(c, '::before');
          const after = window.getComputedStyle(c, '::after');
          const header = c.querySelector('.therapy-card__header');
          const hcs = header ? window.getComputedStyle(header) : null;
          const hBefore = header ? window.getComputedStyle(header, '::before') : null;
          const numTag = c.querySelector('.therapy-card__number-tag');
          const ncs = numTag ? window.getComputedStyle(numTag) : null;
          return {
            index: i,
            title: c.querySelector('.therapy-card__title')?.innerText,
            rect: c.getBoundingClientRect(),
            card: {
              borderTop: cs.borderTop,
              borderBottom: cs.borderBottom,
              boxShadow: cs.boxShadow,
              backgroundColor: cs.backgroundColor,
              textDecoration: cs.textDecoration,
              before: { content: before.content, height: before.height, borderTop: before.borderTop },
              after: { content: after.content, height: after.height, borderTop: after.borderTop }
            },
            header: hcs ? {
              rect: header.getBoundingClientRect(),
              borderTop: hcs.borderTop,
              borderBottom: hcs.borderBottom,
              before: hBefore ? { content: hBefore.content, height: hBefore.height, borderTop: hBefore.borderTop } : null
            } : null,
            numTag: ncs ? {
              textDecoration: ncs.textDecoration,
              borderTop: ncs.borderTop
            } : null
          };
        });

        return {
          dirHeader: getStyles('.therapy-directory-header'),
          grid: getStyles('.therapy-grid'),
          colLeft: getStyles('.therapy-grid__column--left'),
          colRight: getStyles('.therapy-grid__column--right'),
          cards
        };
      })()`,
      returnByValue: true
    });

    console.log(JSON.stringify(evalResult.result.value, null, 2));

    ws.close();
    proc.kill();
  } catch (e) {
    console.error(e);
    proc.kill();
  }
}

inspectDOM();
