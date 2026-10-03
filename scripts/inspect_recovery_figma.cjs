const fs = require('fs');

const data = JSON.parse(fs.readFileSync('public/audit/figma_recovery_live.json', 'utf8'));
const doc = data.nodes['1:2'].document;

function walk(node, depth = 0) {
  let extra = '';
  if (node.characters) {
    extra += ' -> ' + JSON.stringify(node.characters.replace(/\s+/g, ' ').trim());
  }
  if (node.fills && Array.isArray(node.fills)) {
    const imgFill = node.fills.find(f => f.type === 'IMAGE');
    if (imgFill) {
      extra += ' [IMAGE: ' + imgFill.imageRef + ']';
    }
  }
  const dims = node.absoluteBoundingBox ? ' [' + Math.round(node.absoluteBoundingBox.width) + 'x' + Math.round(node.absoluteBoundingBox.height) + ']' : '';
  console.log('  '.repeat(depth) + node.id + ' | ' + node.name + ' (' + node.type + ')' + dims + extra);
  if (node.children) {
    node.children.forEach(c => walk(c, depth + 1));
  }
}

walk(doc, 0);
