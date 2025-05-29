import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const browser = process.env.VITEST_BROWSER

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: './src/setupTests.ts',
   
    // Ambiente dinámico según entorno
    environment: browser ? 'browser' : 'jsdom',

    reporters: [
      'default',
      ['junit', { outputFile: `test-results/junit-${process.env.BROWSER || 'default'}.xml` }]
    ],
  },
})