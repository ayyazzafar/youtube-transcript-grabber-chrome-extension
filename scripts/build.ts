import { copyFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

// Ensure dist directory exists
mkdirSync('dist', { recursive: true });

// Copy manifest.json to dist
copyFileSync(
  resolve('manifest.json'),
  resolve('dist/manifest.json')
);

// Create icons directory
mkdirSync('dist/icons', { recursive: true });

// Copy icons
copyFileSync(
  resolve('public/icons/icon48.png'),
  resolve('dist/icons/icon48.png')
);
copyFileSync(
  resolve('public/icons/icon128.png'),
  resolve('dist/icons/icon128.png')
);

// Ensure all required files exist
const requiredFiles = ['content.js', 'background.js', 'styles.css'];
requiredFiles.forEach(file => {
  if (!resolve(`dist/${file}`)) {
    console.error(`Missing required file: ${file}`);
    process.exit(1);
  }
}); 