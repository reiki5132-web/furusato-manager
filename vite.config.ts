import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        navigateFallback: '/furusato-manager/index.html',
      },
      manifest: {
        name: 'ふるさと納税 家族管理ツール',
        short_name: 'ふるさと納税',
        description: '家族のふるさと納税を一元管理',
        start_url: '/furusato-manager/',
        scope: '/furusato-manager/',
        display: 'standalone',
        background_color: '#f5f5f5',
        theme_color: '#f97316',
        icons: [
          { src: '/furusato-manager/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/furusato-manager/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  base: '/furusato-manager/',
})
