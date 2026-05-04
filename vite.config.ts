import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Hero lazy-loads R3F + three + Drei (~1MB gzipped asset is expected for the GLTF viewer).
    chunkSizeWarningLimit: 1200,
  },
})
