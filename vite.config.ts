import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Otimizações para mobile
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['lucide-react']
  }
})