const { exec } = require('child_process');
const http = require('http');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function main() {
  const scratchDir = 'C:\\Users\\FKode solutiona\\.gemini\\antigravity-ide\\brain\\3c0328bb-9966-4a97-ae16-50cf270d20ff\\scratch';
  const userDataDir = path.join(scratchDir, 'edge-profile-inspect');
  const port = 9555;

  const { spawn } = require('child_process');
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--window-size=1672,941',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  http.get(`http://127.0.0.1:${port}/json`, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', async () => {
      const list = JSON.parse(data);
      const pageTarget = list.find(t => t.type === 'page') || list[0];
      const wsUrl = pageTarget.webSocketDebuggerUrl;
      const ws = new globalThis.WebSocket(wsUrl);
      await new Promise(r => ws.onopen = r);

      let id = 1;
      function send(method, params = {}) {
        return new Promise(resolve => {
          const curId = id++;
          const handler = (evt) => {
            const msg = JSON.parse(evt.data);
            if (msg.id === curId) {
              ws.removeEventListener('message', handler);
              resolve(msg.result);
            }
          };
          ws.addEventListener('message', handler);
          ws.send(JSON.stringify({ id: curId, method, params }));
        });
      }

      await new Promise(r => setTimeout(r, 3000));

      const evalRes = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const root = document.querySelector('#root');
            return {
              rootHtml: root ? root.innerHTML : 'no root',
              documentBody: document.body.innerHTML
            };
          })()
        `,
        returnByValue: true
      });

      console.log('Document Body:', evalRes.result.value.documentBody);

      ws.close();
      proc.kill();
      process.exit(0);
    });
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
