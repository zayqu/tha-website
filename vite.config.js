import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
<<<<<<< HEAD
=======
import { resolve } from 'path'
>>>>>>> 5ac31723d5b9b56bde9fed84c9a0ddf1a28941a9

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
<<<<<<< HEAD
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
})
=======
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
>>>>>>> 5ac31723d5b9b56bde9fed84c9a0ddf1a28941a9
