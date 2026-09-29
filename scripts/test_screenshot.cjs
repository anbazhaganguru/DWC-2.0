const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outputPath = path.resolve(__dirname, '../public/audit_desktop.png');

const args = [
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  '--virtual-time-budget=4000',
  '--window-size=1672,941',
  `--screenshot=${outputPath}`,
  'http://localhost:5173/'
];

console.log('Running Edge screenshot with args:', args.join(' '));

execFile(edgePath, args, { timeout: 15000 }, (error, stdout, stderr) => {
  console.log('Exit. Error:', error ? error.message : 'none');
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
  console.log('File exists?', fs.existsSync(outputPath));
  if (fs.existsSync(outputPath)) {
    console.log('File size:', fs.statSync(outputPath).size);
  }
});
