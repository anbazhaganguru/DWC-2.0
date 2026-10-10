const fs = require('fs');
const readline = require('readline');

async function readUserInputs() {
  const fileStream = fs.createReadStream('C:\\Users\\FKode solutiona\\.gemini\\antigravity-ide\\brain\\d8c02b70-9205-412c-8ebc-afc8fb29a133\\.system_generated\\logs\\transcript.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'USER_INPUT') {
        console.log('--- USER INPUT ---');
        console.log(typeof obj.content === 'string' ? obj.content.slice(0, 500) : JSON.stringify(obj.content).slice(0, 500));
      }
    } catch (e) {}
  }
}
readUserInputs();
