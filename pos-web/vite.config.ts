import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:8080',
      '/products': 'http://localhost:8080',
      '/product-types': 'http://localhost:8080',
      '/payment-methods': 'http://localhost:8080',
      '/orders': 'http://localhost:8080',
      '/brands': 'http://localhost:8080',
      '/reports': 'http://localhost:8080',
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts'
  }
})
