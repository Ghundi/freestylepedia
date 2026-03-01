import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa';

import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';
import fs from 'fs';

import vuetify from 'vite-plugin-vuetify'

import ViteYaml from '@modyfi/vite-plugin-yaml';

import { resolve, dirname } from "node:path";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

export default defineConfig({
  plugins: [
    vue(),
    vuetify(),
    ViteYaml(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/DB',
          dest: 'en',
        },
      ],
    }),
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
  },
  server: {
    // By default Vite disallows serving arbitrary files outside publicDir.
    // `fs.allow` tells Vite it's okay to read from src/DB.
    fs: {
      // allow serving files from the project root and src/DB
      allow: ['..', path.resolve(__dirname, 'src/DB')],
    },

    // Hook into the dev server to add a custom route
    middlewareMode: false,
    // `configureServer` runs after the dev server is created
    // (requires Vite >= 2.9)
    // It adds a simple static-file handler for `/en/DB/*`
    // – the same code works for Vite 5.x as well.
    // If you use an older version, use `configurePreviewServer`.
    configureServer(server) {
      const express = server.middlewares; // Vite uses connect under the hood

      // Serve static files from src/DB under the URL prefix `/en/DB`
      express.use('/en/DB', (req, res, next) => {
        // Resolve the path inside src/DB
        const filePath = path.resolve(__dirname, 'src', 'DB', req.path);
        // Use native fs to check existence and stream the file
        fs.stat(filePath, (err, stats) => {
          if (err || !stats.isFile()) {
            // Not found – let Vite continue to its 404 handler
            return next();
          }
          // Set a sensible content‑type for YAML (optional)
          res.setHeader('Content-Type', 'application/x-yaml');
          // Stream the file
          const stream = fs.createReadStream(filePath);
          stream.pipe(res);
        });
      });
    },
  },
});
