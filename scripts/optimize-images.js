#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC_IMAGES = path.join(ROOT, 'public', 'images');

const IMAGE_RE = /\.(jpg|jpeg|png|webp)$/i;
const GENERATED_RE = /-\d+w\.webp$/i;
const WEBP_QUALITY = 80;

const SIZES = {
  hero: [640, 1024, 1920],
  card: [320, 640, 1080],
  avatar: [80, 160, 320],
  thumbnail: [150, 300],
  logo: [120, 240],
  storyFeatured: [480, 768, 1024]
};

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

async function optimizeImage(inputPath, width, { quality = WEBP_QUALITY } = {}) {
  const parsed = path.parse(inputPath);
  const outputPath = path.join(parsed.dir, `${parsed.name}-${width}w.webp`);

  const pipeline = sharp(inputPath).resize(width, null, {
    fit: 'inside',
    withoutEnlargement: true
  }).webp({ quality, effort: 6 });

  await pipeline.toFile(outputPath);

  const originalSize = fs.statSync(inputPath).size;
  const newSize = fs.statSync(outputPath).size;
  const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

  console.log(`OK ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
  console.log(`  ${formatSize(originalSize)} -> ${formatSize(newSize)} (${savings}% smaller)`);

  return { originalSize, newSize };
}

function isSourceImage(fileName) {
  return IMAGE_RE.test(fileName) && !GENERATED_RE.test(fileName);
}

function hasPreferredSibling(dir, fileName) {
  const parsed = path.parse(fileName);
  const extension = parsed.ext.toLowerCase();
  if (extension === '.jpg' || extension === '.jpeg') return false;

  return fs.existsSync(path.join(dir, `${parsed.name}.jpg`)) ||
    fs.existsSync(path.join(dir, `${parsed.name}.jpeg`));
}

async function processFiles(dir, widths, options = {}) {
  if (!fs.existsSync(dir)) return { originalSize: 0, newSize: 0, files: 0 };

  const stats = { originalSize: 0, newSize: 0, files: 0 };
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const inputPath = path.join(dir, file);
    const fileStat = fs.statSync(inputPath);

    if (fileStat.isDirectory()) {
      const childStats = await processFiles(inputPath, widths, options);
      stats.originalSize += childStats.originalSize;
      stats.newSize += childStats.newSize;
      stats.files += childStats.files;
      continue;
    }

    if (!isSourceImage(file) || hasPreferredSibling(dir, file)) continue;

    const fileWidths = typeof widths === 'function' ? widths(file) : widths;
    for (const width of fileWidths) {
      const result = await optimizeImage(inputPath, width, options);
      stats.originalSize += result.originalSize;
      stats.newSize += result.newSize;
      stats.files += 1;
    }
  }

  return stats;
}

async function main() {
  console.log('THA Image Optimizer\n');

  const jobs = [
    ['hero images', PUBLIC_IMAGES, file => file.startsWith('hero-bg-') ? SIZES.hero : [], { quality: 58 }],
    ['team images', path.join(PUBLIC_IMAGES, 'team'), SIZES.avatar],
    ['news images', path.join(PUBLIC_IMAGES, 'news'), SIZES.card],
    ['testimonial images', path.join(PUBLIC_IMAGES, 'testimonials'), SIZES.avatar],
    ['story images', path.join(PUBLIC_IMAGES, 'stories'), file => file.includes('featured') ? SIZES.storyFeatured : SIZES.thumbnail],
    ['thematic area images', path.join(PUBLIC_IMAGES, 'thematic-areas'), SIZES.card],
    ['partner logos', path.join(PUBLIC_IMAGES, 'partners'), SIZES.logo]
  ];

  const total = { originalSize: 0, newSize: 0, files: 0 };

  for (const [label, dir, widths, options = {}] of jobs) {
    console.log(`\nProcessing ${label}...`);
    const stats = await processFiles(dir, widths, options);
    total.originalSize += stats.originalSize;
    total.newSize += stats.newSize;
    total.files += stats.files;
  }

  console.log('\n' + '='.repeat(50));
  console.log('Optimization complete.');
  console.log(`Files processed: ${total.files}`);
  console.log(`Generated variants total: ${formatSize(total.originalSize)} -> ${formatSize(total.newSize)}`);
  console.log(`Overall reduction: ${((1 - total.newSize / total.originalSize) * 100).toFixed(1)}%`);
  console.log('='.repeat(50));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
