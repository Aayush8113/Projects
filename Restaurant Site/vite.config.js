import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true, // Automatically opens the browser on start
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Set to true only for debugging production issues
    minify: 'terser', // High-level minification for smaller bundle size
    rollupOptions: {
      output: {
        // This keeps your JS and CSS organized in the build folder
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
  // Ensures clean routing for SPAs on hosts like Vercel/Netlify
  appType: 'spa', 
})