const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9640;
const scratchDir = path.resolve(__dirname, '../public/audit/test_scratch/p_console');

const proc = spawn(edgePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${scratchDir}`,
  '--window-size=1440,900',
  'http://localhost:5173/'
]);

setTimeout(() => {
  http.get(`http://127.0.0.1:${port}/json`, res => {
    let d = ''; res.on('data', c => d += c);
    res.on('end', async () => {
      try {
        const list = JSON.parse(d);
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

        const consoleErrors = [];
        const failedRequests = [];

        ws.onmessage = evt => {
          const msg = JSON.parse(evt.data);
          if (msg.method === 'Console.messageAdded' && msg.params.message.level === 'error') {
            consoleErrors.push(msg.params.message.text);
          }
          if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
            consoleErrors.push(JSON.stringify(msg.params.args));
          }
          if (msg.method === 'Network.responseReceived') {
            if (msg.params.response.status >= 400) {
              failedRequests.push({
                url: msg.params.response.url,
                status: msg.params.response.status
              });
            }
          }
        };

        await send('Console.enable');
        await send('Runtime.enable');
        await send('Network.enable');

        // Scroll to therapy to trigger lazy images
        await send('Runtime.evaluate', {
          expression: `(async () => {
            const el = document.querySelector('#therapy');
            if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
            // Also force lazy images to load immediately for test
            document.querySelectorAll('#therapy img').forEach(img => {
              img.loading = 'eager';
            });
          })()`
        });

        await new Promise(r => setTimeout(r, 3000));

        // Evaluate all therapy images loaded status in DOM
        const imgCheck = await send('Runtime.evaluate', {
          expression: `(() => {
            const imgs = Array.from(document.querySelectorAll('#therapy img')).map(img => ({
              src: img.getAttribute('src'),
              naturalWidth: img.naturalWidth,
              naturalHeight: img.naturalHeight,
              complete: img.complete
            }));
            return imgs;
          })()`,
          returnByValue: true
        });

        console.log('Therapy images status in DOM:', JSON.stringify(imgCheck.result.value, null, 2));
        console.log('Console Errors count:', consoleErrors.length, consoleErrors);
        console.log('Failed Requests count:', failedRequests.length, failedRequests);

        ws.close();
        proc.kill();
        process.exit(0);
      } catch (err) {
        console.error(err);
        proc.kill();
        process.exit(1);
      }
    });
  }).on('error', err => {
    console.error(err);
    proc.kill();
    process.exit(1);
  });
}, 2000);
