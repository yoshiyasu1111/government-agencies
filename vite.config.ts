import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://yoshiyasu1111.github.io',
  base: '/government-agencies',
  plugins: [
    tailwindcss(),
  ],
})
