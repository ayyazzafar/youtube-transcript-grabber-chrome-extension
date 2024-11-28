import { defineConfig, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Base configuration
const baseConfig: UserConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
}

// Determine which config to use based on command line argument
const env = process.env.VITE_BUILD_TARGET || 'content'

const config: UserConfig = {
  ...baseConfig,
  build: {
    outDir: 'dist',
    emptyOutDir: env === 'content',
    rollupOptions: {
      input: env === 'content' 
        ? resolve(__dirname, 'src/content/index.tsx')
        : resolve(__dirname, 'src/background.ts'),
      output: {
        entryFileNames: env === 'content' ? 'content.js' : 'background.js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'styles.css';
          }
          return 'assets/[name].[hash].[ext]';
        },
        format: 'iife',
        inlineDynamicImports: true
      }
    },
    cssCodeSplit: false
  }
}

export default defineConfig(config)
