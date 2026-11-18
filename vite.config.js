import { cpSync, createReadStream, copyFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const scriptsPath = fileURLToPath(new URL('./js', import.meta.url));
const wasmPath = fileURLToPath(
  new URL('./node_modules/sql.js/dist/sql-wasm.wasm', import.meta.url)
);

export default defineConfig({
  plugins: [
    {
      name: 'recursos-da-aplicacao',
      configureServer(server) {
        server.middlewares.use('/assets/sql-wasm.wasm', (request, response, next) => {
          if (request.method !== 'GET' && request.method !== 'HEAD') return next();
          response.setHeader('Content-Type', 'application/wasm');
          createReadStream(wasmPath).pipe(response);
        });
      },
      closeBundle() {
        cpSync(scriptsPath, 'dist/js', { recursive: true });
        mkdirSync('dist/assets', { recursive: true });
        copyFileSync(wasmPath, 'dist/assets/sql-wasm.wasm');
      },
    },
  ],
});
