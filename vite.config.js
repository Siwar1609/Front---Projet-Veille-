import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/


export default defineConfig({
  plugins: [tailwindcss(),react(),],optimizeDeps: {
    include: [
      '@react-pdf/renderer',
      // Ajoutez d'autres dépendances si nécessaire
    ],
    exclude: ['@react-pdf/renderer'] // Important pour éviter les conflits
  }
})
