const fs = require('fs');
const path = require('path');
const https = require('https');

const imgMap = JSON.parse(fs.readFileSync('public/audit/figma_images_map.json', 'utf8'));
const targetDir = path.resolve(__dirname, '../public/images/therapy');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const refNameMap = {
  'd9fd214480f58d1040fd9f3fa03629382027ccce': 'irobo_chair_studio_original.png',
  'f3f0abf65a713ee71270b1ffe5e152c6e4c02d68': 'modality_01_reflexology_original.png',
  'cbbf7e08ca926ed554a6326833bfed9e4d9c8589': 'modality_02_taping_original.png',
  'a8f2740abd502009d1bcab13e8bd687ab0c97097': 'modality_03_ice_cupping_original.png',
  'adcf175b1f71f80bf91424f3bda38cbdd5d0242a': 'modality_04_steam_bath_original.png',
  '214f02ffff56578a5c79eb42c26eb55bc71174fc': 'modality_05_bamboo_original.png',
  '0a1b0cdfd200c1dda77082d05ba66937b054d0c1': 'modality_06_cupping_original.png'
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download: status ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log('Downloading original full-res Figma image assets...');
  for (const [ref, filename] of Object.entries(refNameMap)) {
    const url = imgMap[ref];
    if (url) {
      const dest = path.join(targetDir, filename);
      await download(url, dest);
      console.log(`Saved ${filename}: ${fs.statSync(dest).size} bytes`);
    } else {
      console.warn(`URL not found for ref ${ref}`);
    }
  }
}

downloadAll().catch(console.error);
