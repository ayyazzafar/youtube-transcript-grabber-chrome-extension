import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { resolve } from 'path';

const sizes = [16, 48, 128];

// Ensure the public/icons directory exists
mkdirSync(resolve('public/icons'), { recursive: true });

async function generateIcons() {
  // Create a simple colored square as base icon
  const base = sharp({
    create: {
      width: 128,
      height: 128,
      channels: 4,
      background: { r: 66, g: 133, b: 244, alpha: 1 }
    }
  });

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
