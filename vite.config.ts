import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/cleo/',      // <-- IMPORTANT for GitHub Pages under /cleo/
  plugins: [react()],
})
