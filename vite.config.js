import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  plugins: [{
    name: 'geo-theme-after-bootstrap',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const theme = html.match(/<link\b[^>]*href="[^\"]*theme\/geo-bootstrap\.css"[^>]*>/)?.[0];
        return theme ? html.replace(theme, '').replace('</head>', `${theme}\n</head>`) : html;
      },
    },
  }],
  server: { host: '127.0.0.1' },
  build: { rollupOptions: { input: { main: resolve('index.html'), gallery: resolve('gallery.html') } } },
});
