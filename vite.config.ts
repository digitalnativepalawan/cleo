import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      server: {
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
            configure: (proxy, options) => {
              // Fallback handler for when the API server isn't running
              proxy.on('error', (err, req, res) => {
                console.warn('API proxy error, serving fallback response');
                if (req.url?.includes('/api/upload')) {
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({
                    url: `https://via.placeholder.com/400x300/e2e8f0/64748b?text=Demo+Upload`,
                    key: `demo-${Date.now()}`,
                    message: 'Demo upload (API server not running)'
                  }));
                } else {
                  res.writeHead(404, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'API not available' }));
                }
              });
            }
          }
        }
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
