import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Minify CSS and JS
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
      },
    },
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation-vendor': ['framer-motion', 'lenis'],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '4173'),
  },
});
