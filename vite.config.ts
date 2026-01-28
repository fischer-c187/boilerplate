import devServer, { defaultOptions } from '@hono/vite-dev-server'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

const ssrBuild = {
  outDir: 'dist/server',
  ssrEmitAssets: true,
  copyPublicDir: false,
  emptyOutDir: false,
  rollupOptions: {
    input: resolve(__dirname, 'src/server/index.ts'),
    output: {
      entryFileNames: 'index.js',
      chunkFileNames: 'assets/[name]-[hash].js',
      assetFileNames: 'assets/[name]-[hash][extname]',
    },
  },
  ssr: true,
}

const clientBuild = {
  outDir: 'dist/client',
  copyPublicDir: true,
  emptyOutDir: true,
  rollupOptions: {
    input: resolve(__dirname, 'src/front/entry-client.tsx'),
    output: {
      entryFileNames: 'assets/[name].js',
      chunkFileNames: 'assets/[name]-[hash].js',
      assetFileNames: 'assets/[name]-[hash][extname]',
      manualChunks: {
        // React core
        'vendor-react': ['react', 'react-dom'],
        // TanStack ecosystem
        'vendor-tanstack': ['@tanstack/react-query', '@tanstack/react-router'],
        // i18n
        'vendor-i18n': ['i18next', 'react-i18next'],
        // Validation
        'vendor-zod': ['zod'],
      },
    },
  },
  manifest: true,
}
// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
      routesDirectory: 'src/front/routes',
      generatedRouteTree: 'src/front/routeTree.gen.ts',
    }),
    react(),
    tailwindcss(),
    devServer({
      entry: 'src/server/index.ts',
      injectClientScript: false,
      exclude: [
        /^\/src\/.+/, // Allow Vite to handle /src/ requests
        ...defaultOptions.exclude,
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      all: true,
      include: [
        'src/server/middleware/auth.ts',
        'src/server/services/stripe/validation.ts',
        'src/server/services/stripe/checkout.service.ts',
        'src/server/services/stripe/webhook.service.ts',
        'src/server/adaptaters/mail/mailer.ts',
        'src/server/adaptaters/mail/transports/smtp.ts',
        'src/server/adaptaters/mail/transports/resend.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  build: mode === 'client' ? clientBuild : ssrBuild,
}))
