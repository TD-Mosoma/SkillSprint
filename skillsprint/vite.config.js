import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// base './' lets the static build work on GitHub Pages sub-paths
export default defineConfig({ plugins: [react()], base: './' })
