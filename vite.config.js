import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/Soner-Landing-Page/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        solicitar: resolve(__dirname, 'solicitar.html')
      }
    }
  }
})
