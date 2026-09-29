const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:\\Users\\FKode solutiona\\.gemini\\antigravity-ide\\brain\\3c0328bb-9966-4a97-ae16-50cf270d20ff\\.system_generated\\logs\\transcript.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (!line) continue;
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'USER_INPUT' && obj.step_index >= 300) {
        console.log('--- USER_INPUT at step', obj.step_index, '---');
        console.log(obj.content ? obj.content.substring(0, 500) : 'no content');
      }
    } catch (e) {}
  }
}

processLineByLine();
