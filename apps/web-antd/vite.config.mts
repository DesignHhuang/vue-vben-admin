import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/test-api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/test-api/, ''),
            // mock代理目标地址
            target: 'http://test.wattdesk.com:8082/',
            ws: true,
          },
          '/prod-api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/prod-api/, ''),
            // mock代理目标地址
            target: 'http://api.bms-desk.com:8082/',
            ws: true,
          },
        },
      },
    },
  };
});
