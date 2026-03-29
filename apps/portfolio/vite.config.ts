import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { timelinePlugin } from './src/vite-plugin-timeline'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), timelinePlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // @ts-ignore - vitest extends vite config
  test: {
    environment: 'jsdom',
    globals: true
  }
})
