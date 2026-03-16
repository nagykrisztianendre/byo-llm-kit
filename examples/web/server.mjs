import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { handleGenerateRequest } from "../../dist/examples/web/api/generate.js";
import { renderPlaygroundPage } from "../../dist/examples/web/pages/playground.js";
import { loadConfig } from "../../dist/src/config/loadConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const indexHtmlPath = join(__dirname, "public", "index.html");
const DEFAULT_PORT = 3000;

const config = loadConfig();

function sendJson(response, statusCode, body) {
  response.statusCode = statusCode;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.end(JSON.stringify(body));
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");

  if (request.method === "GET" && url.pathname === "/health") {
    return sendJson(response, 200, { ok: true, provider: config.provider });
  }

  if (request.method === "POST" && url.pathname === "/api/generate") {
    return handleGenerateRequest(request, response, config);
  }

  if (request.method === "GET" && url.pathname === "/") {
    const html = await readFile(indexHtmlPath, "utf8");
    response.statusCode = 200;
    response.setHeader("content-type", "text/html; charset=utf-8");
    response.end(html);
    return;
  }

  if (request.method === "GET" && url.pathname === "/playground") {
    response.statusCode = 200;
    response.setHeader("content-type", "text/html; charset=utf-8");
    response.end(renderPlaygroundPage());
    return;
  }

  sendJson(response, 404, { error: "Not Found" });
});

const port = Number(process.env.PORT ?? DEFAULT_PORT);
server.listen(port, () => {
  process.stdout.write(
    `web example listening on http://0.0.0.0:${port} (provider=${config.provider})\n`,
  );
});
