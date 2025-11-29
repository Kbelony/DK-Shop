import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // En développement local, les routes /api sont gérées par Vercel CLI
    // Si vous utilisez `vercel dev`, les fonctions serverless tournent sur le port 3000
    // Si vous n'utilisez pas Vercel CLI, désactivez le proxy ou utilisez un autre backend
    proxy: process.env.VERCEL
      ? undefined // Pas de proxy si on est sur Vercel
      : {
          '/api': {
            target: process.env.VITE_API_BASE_URL || 'http://localhost:3000',
            changeOrigin: true,
            // Désactiver le proxy si Vercel CLI n'est pas utilisé
            configure: (proxy, _options) => {
              proxy.on('error', (err, _req, res) => {
                console.warn('API proxy error. Make sure Vercel CLI is running: vercel dev');
                if (res && !res.headersSent) {
                  res.writeHead(500, {
                    'Content-Type': 'text/plain',
                  });
                  res.end('API server not available. Run "vercel dev" to start the serverless functions.');
                }
              });
            },
          },
        },
  },
})
