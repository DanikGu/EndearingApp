import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
// @ts-ignore
export default ({ mode }) => {
  return defineConfig({
    plugins: [sveltekit()],
    server: {
      proxy: {
        '/api': {
          target: loadEnv(mode, process.cwd()).VITE_API_URL,
          secure: false,
          configure: (proxy, _options) => {
            let log = console.log;
            if (mode !== "development") {
              log = () => { };
            }
            proxy.on("error", (err, _req, _res) => {
              log("proxy error", err);
            });
            proxy.on("proxyReq", (proxyReq, req, _res) => {
              log(
                "Sending Request:",
                req.method,
                req.url,
                " => TO THE TARGET =>  ",
                proxyReq.method,
                proxyReq.protocol,
                proxyReq.host,
                proxyReq.path,
              );
            });
            proxy.on("proxyRes", (proxyRes, req, _res) => {
              log(
                "Received Response from the Target:",
                proxyRes.statusCode,
                req.url,
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
