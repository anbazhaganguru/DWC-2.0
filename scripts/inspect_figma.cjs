const fs = require('fs');

const data = JSON.parse(fs.readFileSync('public/audit/figma_node_1_2.json', 'utf8'));
const doc = data.nodes ? data.nodes['1:2'].document : data.document;

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
  console.log(`${'  '.repeat(depth)}${node.id} | ${node.name} (${node.type})${extra}`);
  if (node.children) {
    node.children.forEach(c => walk(c, depth + 1));
  }
}

walk(doc, 0);

