const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const port = 9560;
const userDataDir = path.resolve(__dirname, '../tools/edge-profile-9560');
if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const proc = spawn(edgePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  `--remote-debugging-port=${port}`,
  '--remote-debugging-address=127.0.0.1',
  `--user-data-dir=${userDataDir}`,
  'http://localhost:5173/'
]);

setTimeout(() => {
  http.get(`http://127.0.0.1:${port}/json`, (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
      try {
        const list = JSON.parse(d);
        const pageTarget = list.find(t => t.type === 'page') || list[0];
        const ws = new globalThis.WebSocket(pageTarget.webSocketDebuggerUrl);
        ws.onopen = () => {
          ws.send(JSON.stringify({
            id: 1,
            method: 'Runtime.evaluate',
            params: {
              expression: `({
                heroContent: !!document.querySelector('.hero-content'),
                heroText: document.querySelector('.hero-headline') ? document.querySelector('.hero-headline').innerText : 'NO HEADLINE',
                opacity: document.querySelector('.hero-content') ? window.getComputedStyle(document.querySelector('.hero-content')).opacity : 'NO ELEM',
                html: document.querySelector('.hero-content') ? document.querySelector('.hero-content').outerHTML : 'NO HTML'
              })`,
              returnByValue: true
            }
          }));
        };
        ws.onmessage = (evt) => {
          const m = JSON.parse(evt.data);
          if (m.id === 1) {
            console.log('DOM CHECK RESULT:', JSON.stringify(m.result.result.value, null, 2));
            ws.close();
            proc.kill();
            process.exit(0);
          }
        };
      } catch (err) {
        console.error('Error:', err);
        proc.kill();
        process.exit(1);
      }
    });
  }).on('error', (err) => {
    console.error('HTTP error:', err);
    proc.kill();
    process.exit(1);
  });
}, 3000);
