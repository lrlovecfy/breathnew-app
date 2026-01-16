import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Prioritize keys in this order
  const rawApiKey = env.API_KEY || env.GEMINI_API_KEY || env.VITE_API_KEY || env.VITE_GEMINI_API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // JSON.stringify is crucial here to safely inject the string into the code
      'process.env.API_KEY': JSON.stringify(rawApiKey)
    }
  }
})