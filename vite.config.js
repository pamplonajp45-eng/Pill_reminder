import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VERCEL ? '/' : '/Pill_reminder/',
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'LUNO.png', 'reminder.mp3', 'reminder2.mp3', 'reminder3.mp3', 'reminder4.mp3'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3}'],
      },
      manifest: {
        name: 'LUNO',
        short_name: 'LUNO',
        description: 'Luno keeps you on track, quietly guiding you to take your meds on time.',
        theme_color: '#4CAF50',
        icons: [
          {
            src: 'LUNO.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'LUNO.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'LUNO.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
