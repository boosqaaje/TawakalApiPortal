import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { DEFAULT_API_BASE_URL, stripTrailingSlash } from './src/constants.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = stripTrailingSlash(env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL)

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
