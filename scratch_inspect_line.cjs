const fs = require('fs');

const content = fs.readFileSync('src/styles/therapy.css', 'utf8');
const lines = content.split('\n');

console.log('=== CSS Search for lines/borders in therapy.css ===');
lines.forEach((line, i) => {
  if (/border|shadow|gradient|before|after|grid|line/i.test(line)) {
    console.log(`${i+1}: ${line.trim()}`);
  }
});
