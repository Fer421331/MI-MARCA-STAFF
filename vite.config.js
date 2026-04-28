import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// ─── GitHub Pages deployment config ──────────────────────────────────────────
// Base path must match the repository name exactly.
// Change this if the repo name changes.
const GITHUB_PAGES_BASE = '/MI-MARCA-STAFF/'

// In local dev (npm run dev) we serve from '/' as usual.
const base = process.env.NODE_ENV === 'production' ? GITHUB_PAGES_BASE : '/'

export default defineConfig({
  plugins: [react()],

  // ── Base path ───────────────────────────────────────────────────────────────
  base,

  // ── Path aliases ────────────────────────────────────────────────────────────
  resolve: {
    alias: {
      '@':          path.resolve(__dirname, './src'),
      '@components':path.resolve(__dirname, './src/components'),
      '@pages':     path.resolve(__dirname, './src/pages'),
      '@layouts':   path.resolve(__dirname, './src/layouts'),
      '@contexts':  path.resolve(__dirname, './src/contexts'),
      '@routes':    path.resolve(__dirname, './src/routes'),
      '@hooks':     path.resolve(__dirname, './src/hooks'),
      '@services':  path.resolve(__dirname, './src/services'),
      '@styles':    path.resolve(__dirname, './src/styles'),
    },
  },

  // ── Build optimizations ──────────────────────────────────────────────────────
  build: {
    outDir:       'dist',
    emptyOutDir:  true,
    sourcemap:    false,   // disable for production (enable for debugging)
    minify:       'oxc',   // Vite 8 default — uses Oxc (esbuild removed)

    rollupOptions: {
      output: {
        // Chunk splitting — function form required by Vite 8 (Rolldown)
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/react-router')) {
            return 'vendor-router'
          }
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/clsx')) {
            return 'vendor-ui'
          }
        },
        // Deterministic filenames with content hash
        chunkFileNames:  'assets/js/[name]-[hash].js',
        entryFileNames:  'assets/js/[name]-[hash].js',
        assetFileNames:  'assets/[ext]/[name]-[hash].[ext]',
      },
    },

    // Warn when a chunk exceeds 500 kB
    chunkSizeWarningLimit: 500,
  },

  // ── Dev server ──────────────────────────────────────────────────────────────
  server: {
    port:        5173,
    strictPort:  false,
    open:        false,
    // Proxy placeholder — wire to Supabase API when ready
    // proxy: {
    //   '/api': { target: 'http://localhost:3000', changeOrigin: true },
    // },
  },

  // ── Preview server (npm run preview) ────────────────────────────────────────
  preview: {
    port: 4173,
  },
})
