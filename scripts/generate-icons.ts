import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { resolve } from 'path';

const sizes = [16, 48, 128];

// Ensure the public/icons directory exists
mkdirSync(resolve('public/icons'), { recursive: true });

async function generateIcons() {
  // Create a YouTube transcript icon using SVG
  const clipboardSvg = `
    <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
      <!-- Clipboard background -->
      <rect x="32" y="20" width="64" height="88" fill="#4285f4" rx="8"/>
      <rect x="44" y="12" width="40" height="16" fill="#4285f4" rx="4"/>
      
      <!-- YouTube play button -->
      <circle cx="64" cy="48" r="16" fill="#FF0000"/>
      <path d="M58 40v16l14-8z" fill="white"/>
      
      <!-- Transcript lines -->
      <rect x="40" y="72" width="48" height="6" fill="white" rx="2"/>
      <rect x="40" y="84" width="48" height="6" fill="white" rx="2"/>
      <rect x="40" y="96" width="48" height="6" fill="white" rx="2"/>
    </svg>`;

  // Create base icon from SVG
  const base = sharp(Buffer.from(clipboardSvg));

  // Generate icons for each size
  await Promise.all(
    sizes.map(size =>
      base
        .clone()
        .resize(size, size)
        .toFile(resolve(`public/icons/icon${size}.png`))
    )
  );

  console.log('Icons generated successfully!');
}

generateIcons().catch(console.error);
