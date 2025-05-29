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

    /* // Configuración solo si se usa navegador real
    ...(browser && {
      browser: {
        enabled: true,
        name: browser,
        headless: true,
      },
      reporters: ['default', 'junit'],
      outputFile: {
       junit: `test-results/junit-${browser}.xml`
      },
      testTimeout: 20000,
    }),

    // Config por defecto si NO es navegador
    ...(!browser && {
      reporters: ['default'],
      testTimeout: 5000,
    }) */
  },
})