import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build optimizations
  build: {
    // Generate sourcemap for production debugging
    sourcemap: false, // Set to true if needed for debugging
    
    // Rollup options for bundle optimization
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // Vendor libraries
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-styling': ['styled-components'],
          'vendor-openai': ['openai'],
          
          // App chunks
          'components': ['./src/components/index.ts'],
          'pages': ['./src/pages/index.ts']
        }
      }
    },
    
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000
  },
  
  // Optimization options
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'styled-components']
  },
  
  // Development server options
  server: {
    // Enable file system serving for absolute paths
    fs: {
      strict: false
    }
  }
})
