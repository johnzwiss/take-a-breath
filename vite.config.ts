import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Repository name for GitHub Pages deployment
const REPO_NAME = 'take-a-breath'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? `/${REPO_NAME}/` : '/',
})
