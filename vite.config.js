import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = (env.VITE_API_BASE_URL || 'http://localhost:5278').replace(/\/+$/, '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      proxy: {
        '/portal': { target: apiTarget, changeOrigin: true },
        '/partner/auth': { target: apiTarget, changeOrigin: true },
        '/transaction': { target: apiTarget, changeOrigin: true },
      },
    },
  }
})
