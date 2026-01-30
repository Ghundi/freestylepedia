import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa';

import vuetify from 'vite-plugin-vuetify'

import ViteYaml from '@modyfi/vite-plugin-yaml';

import { resolve, dirname } from "node:path";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

export default defineConfig({
  plugins: [
    vue(),
    vuetify(),
    ViteYaml(),
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**'),
      strictMessage: false
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      injectRegister: 'auto',
      manifest: {
        name: 'Freestylepedia',
        short_name: 'Freestylepedia',
        description: "A place to lookup tricks and watch your progress",
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: '/src/assets/Blackbirdlogoneuwei - 192x192.jpg',
            sizes: '192x192',
            type: 'image/jpg'
          },
          {
            src: '/src/assets/Blackbirdlogoneuwei - 512x512.jpg',
            sizes: '512x512',
            type: 'image/jpg'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
