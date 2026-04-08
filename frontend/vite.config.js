import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // New clean CRUD endpoints: /api/weather/** → backend /api/weather/**
      '/api/weather': {
        target: 'http://localhost:2222',
        changeOrigin: true,
      },
      // OpenWeatherMap proxy: /api/current → backend /api/current
      '/api/current': {
        target: 'http://localhost:2222',
        changeOrigin: true,
      },
      // Legacy endpoint: /api/* (catch-all) → /weather/api/* on backend
      '/api': {
        target: 'http://localhost:2222',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/weather/api'),
      },
    }
  }
})
