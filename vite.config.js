import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-404-html',
      closeBundle() {
        const distDir = path.resolve(process.cwd(), 'dist')
        const indexHtml = path.join(distDir, 'index.html')
        const notFoundHtml = path.join(distDir, '404.html')
        if (fs.existsSync(indexHtml)) {
          fs.copyFileSync(indexHtml, notFoundHtml)
        }
      }
    }
  ],
  base: '/DWC-2.0/',
})