
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // Ini akan memetakan VITE_API_KEY dari Vercel ke process.env.API_KEY di browser
    'process.env.API_KEY': JSON.stringify(process.env.VITE_API_KEY)
  }
})
