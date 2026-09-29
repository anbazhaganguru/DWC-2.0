import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const RIFE_EXE = path.join(
  rootDir,
  'tools',
  'rife-ncnn-vulkan-20221029-windows',
  'rife-ncnn-vulkan.exe'
);

const MODEL_DIR = path.join(
  rootDir,
  'tools',
  'rife-ncnn-vulkan-20221029-windows',
  'rife-v4'
);

if (!fs.existsSync(RIFE_EXE)) {
  console.error(`RIFE executable not found at: ${RIFE_EXE}`);
  process.exit(1);
}

const targets = [
  {
    name: 'desktop',
    sourceDir: path.join(rootDir, 'public', 'images', 'cinematic', 'hero', 'desktop'),
    filePrefix: 'desktop_frame_',
    outDir: path.join(rootDir, 'public', 'images', 'cinematic', 'hero', 'interpolated', 'desktop')
  },
  {
    name: 'mobile',
    sourceDir: path.join(rootDir, 'public', 'images', 'cinematic', 'hero', 'mobile'),
    filePrefix: 'mobile_frame_',
    outDir: path.join(rootDir, 'public', 'images', 'cinematic', 'hero', 'interpolated', 'mobile')
  }
];

const requestedTarget = process.argv[2] || 'all';

function pad3(num) {
  return String(num).padStart(3, '0');
}

function pad2(num) {
  return String(num).padStart(2, '0');
}

function processSequence(target) {
  console.log(`\n========================================`);
  console.log(`Processing ${target.name.toUpperCase()} sequence`);
  console.log(`Source: ${target.sourceDir}`);
  console.log(`Output: ${target.outDir}`);
  console.log(`========================================\n`);

  fs.mkdirSync(target.outDir, { recursive: true });

  // 16 original frames -> 15 intervals -> 3 intermediate frames per interval
  // Total frames: 15 * 4 + 1 = 61 frames
  const TOTAL_ORIGINAL = 16;
  const TOTAL_INTERPOLATED = (TOTAL_ORIGINAL - 1) * 4 + 1; // 61

  for (let i = 1; i <= TOTAL_ORIGINAL - 1; i++) {
    const src0 = path.join(target.sourceDir, `${target.filePrefix}${pad2(i)}.png`);
    const src1 = path.join(target.sourceDir, `${target.filePrefix}${pad2(i + 1)}.png`);

    if (!fs.existsSync(src0) || !fs.existsSync(src1)) {
      throw new Error(`Missing source frame: ${src0} or ${src1}`);
    }

    // Keyframe i (at index (i - 1) * 4 + 1)
    const keyframeIndex = (i - 1) * 4 + 1;
    const keyframeOut = path.join(target.outDir, `frame_${pad3(keyframeIndex)}.png`);
    if (!fs.existsSync(keyframeOut) || fs.statSync(keyframeOut).size === 0) {
      console.log(`[${target.name}] [${pad3(keyframeIndex)}/${pad3(TOTAL_INTERPOLATED)}] Copying master frame ${pad2(i)}`);
      fs.copyFileSync(src0, keyframeOut);
    } else {
      console.log(`[${target.name}] [${pad3(keyframeIndex)}/${pad3(TOTAL_INTERPOLATED)}] Master frame ${pad2(i)} exists`);
    }

    // 3 intermediate frames: t = 0.25, 0.50, 0.75
    const steps = [
      { step: '0.25', offset: 1, label: 'A' },
      { step: '0.50', offset: 2, label: 'B' },
      { step: '0.75', offset: 3, label: 'C' }
    ];

    for (const { step, offset, label } of steps) {
      const frameIdx = (i - 1) * 4 + 1 + offset;
      const outPath = path.join(target.outDir, `frame_${pad3(frameIdx)}.png`);

      if (fs.existsSync(outPath) && fs.statSync(outPath).size > 100000) {
        console.log(`[${target.name}] [${pad3(frameIdx)}/${pad3(TOTAL_INTERPOLATED)}] Frame ${pad3(frameIdx)} (${pad2(i)}${label}) already exists`);
        continue;
      }

      console.log(`[${target.name}] [${pad3(frameIdx)}/${pad3(TOTAL_INTERPOLATED)}] Interpolating pair ${pad2(i)} -> ${pad2(i + 1)} (t=${step})...`);
      
      const args = [
        '-0', src0,
        '-1', src1,
        '-s', step,
        '-m', MODEL_DIR,
        '-o', outPath
      ];

      const t0 = Date.now();
      try {
        execFileSync(RIFE_EXE, args, { stdio: 'pipe' });
        const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
        const sizeMb = (fs.statSync(outPath).size / (1024 * 1024)).toFixed(2);
        console.log(`       ✓ Done in ${elapsed}s (${sizeMb} MB)`);
      } catch (err) {
        console.error(`Error generating frame ${frameIdx}:`, err.message);
        throw err;
      }
    }
  }

  // Copy final frame 16 (index 61)
  const finalSrc = path.join(target.sourceDir, `${target.filePrefix}${pad2(TOTAL_ORIGINAL)}.png`);
  const finalOut = path.join(target.outDir, `frame_${pad3(TOTAL_INTERPOLATED)}.png`);
  if (!fs.existsSync(finalOut) || fs.statSync(finalOut).size === 0) {
    console.log(`[${target.name}] [${pad3(TOTAL_INTERPOLATED)}/${pad3(TOTAL_INTERPOLATED)}] Copying master frame ${pad2(TOTAL_ORIGINAL)}`);
    fs.copyFileSync(finalSrc, finalOut);
  } else {
    console.log(`[${target.name}] [${pad3(TOTAL_INTERPOLATED)}/${pad3(TOTAL_INTERPOLATED)}] Master frame ${pad2(TOTAL_ORIGINAL)} exists`);
  }

  console.log(`\n✓ Completed ${target.name} sequence: ${TOTAL_INTERPOLATED} frames created.\n`);
}

for (const target of targets) {
  if (requestedTarget === 'all' || requestedTarget === target.name) {
    processSequence(target);
  }
}

console.log('All requested sequences successfully processed.');
