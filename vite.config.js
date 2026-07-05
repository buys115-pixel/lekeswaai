import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// LekeSwaai — vite config
// Note: tfjs models are large; we keep them lazy-loaded (see lib/poseDetection.js)
// so the initial bundle stays light.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
})
