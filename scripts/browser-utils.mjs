import { fileURLToPath } from "node:url";
import { createServer, preview } from "vite";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

export async function startDevelopmentServer() {
  const server = await createServer({
    root: projectRoot,
    server: { host: "127.0.0.1", port: 0, open: false, watch: null },
  });
  await server.listen();
  return {
    url: server.resolvedUrls.local[0],
    close: () => server.close(),
  };
}

export async function startPreviewServer() {
  const server = await preview({
    root: projectRoot,
    preview: { host: "127.0.0.1", port: 0, open: false },
  });
  return {
    url: server.resolvedUrls.local[0],
    close: () =>
      new Promise((resolve, reject) => {
        server.httpServer.close((error) => (error ? reject(error) : resolve()));
        server.httpServer.closeAllConnections();
      }),
  };
}

export function launchBrowser(chromium, options = {}) {
  return chromium.launch({
    headless: true,
    ...options,
    ...(process.env.CHROME_EXECUTABLE_PATH
      ? { executablePath: process.env.CHROME_EXECUTABLE_PATH }
      : {}),
  });
}
