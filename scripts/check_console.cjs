const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const port = 9557;
const scratchDir = 'C:\\Users\\FKode solutiona\\.gemini\\antigravity-ide\\brain\\3c0328bb-9966-4a97-ae16-50cf270d20ff\\scratch';
const proc = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless=new', '--disable-gpu', '--no-sandbox',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${path.join(scratchDir, 'edge-profile-console')}`,
  'http://localhost:5173/'
]);

setTimeout(() => {
  http.get(`http://127.0.0.1:${port}/json`, res => {
    let d = ''; res.on('data', c => d += c);
    res.on('end', async () => {
      const list = JSON.parse(d);
      const pageTarget = list.find(t => t.type === 'page');
      if (!pageTarget) {
        console.log('No page target found');
        proc.kill();
        return;
      }
      const ws = new globalThis.WebSocket(pageTarget.webSocketDebuggerUrl);
      ws.onopen = async () => {
        ws.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
        ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
        
        ws.onmessage = evt => {
          const msg = JSON.parse(evt.data);
          if (msg.method === 'Runtime.consoleAPICalled' || msg.method === 'Runtime.exceptionThrown') {
            console.log('BROWSER LOG:', JSON.stringify(msg, null, 2));
          }
        };

        await new Promise(r => setTimeout(r, 3000));

        // Evaluate simple check
        ws.send(JSON.stringify({
          id: 3,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              ({
                heroContentExists: !!document.querySelector('.hero-content'),
                headlineExists: !!document.querySelector('.hero-headline'),
                heroText: document.querySelector('.hero-headline') ? document.querySelector('.hero-headline').innerText : 'NOT FOUND',
                opacity: document.querySelector('.hero-content') ? window.getComputedStyle(document.querySelector('.hero-content')).opacity : 'N/A'
              })
            `,
            returnByValue: true
          }
        }));

        const waitForEval = (evt) => {
          const m = JSON.parse(evt.data);
          if (m.id === 3) {
            console.log('EVAL RESULT:', m.result.result.value);
            ws.close();
            proc.kill();
            process.exit(0);
          }
        };
        ws.addEventListener('message', waitForEval);
      };
    });
  });
}, 1500);
