import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import path from 'path';
// @ts-ignore
export default ({ mode }) => {

  return defineConfig({
    plugins: [sveltekit()],
    server: {
      proxy: {
        '/api': {
          target: loadEnv(mode, process.cwd()).VITE_API_URL,
          //rewrite: path => path.replace(/^\/api/, ''),
          configure: (proxy, _options) => {
            if (mode !== "development") {
              return;
            }
            proxy.on("error", (err, _req, _res) => {
              console.log("proxy error", err);
            });
            proxy.on("proxyReq", (proxyReq, req, _res) => {
              console.log(
                "Sending Request:",
                req.method,
                req.url,
                " => TO THE TARGET =>  ",
                proxyReq.method,
                proxyReq.protocol,
                proxyReq.host,
                proxyReq.path,
                //JSON.stringify(proxyReq.getHeaders()),
              );
            });
            proxy.on("proxyRes", (proxyRes, req, _res) => {
              console.log(
                "Received Response from the Target:",
                proxyRes.statusCode,
                req.url,
                //JSON.stringify(proxyRes.headers),
              );
            });
          },
        }
      }
    },
    test: {
      include: ['src/**/*.{test,spec}.{js,ts}']
    }
  });
};
