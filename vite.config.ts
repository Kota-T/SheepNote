import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      manifest: {
        "lang": "ja",
        "name": "ひつじノート",
        "short_name": "ひつじノート",
        "description": "訪問した人の情報と訪問内容を楽しく管理できるアプリです。",
        "theme_color": "##fff9f3",
        "background_color": "#fff9f3",
        "display": "standalone",
        "icons": [
          {
            "src": "/pwa-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "/pwa-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ]
      }
    })
  ]
})
