import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    watch: {
      ignored: ['/db.json'] // ✅ Glob pattern to match db.json in any folder
    }
  }
})