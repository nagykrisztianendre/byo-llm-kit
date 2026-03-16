import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { generateText } from "../../dist/src/generateText.js";
import { loadConfig } from "../../dist/src/config/loadConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const indexHtmlPath = join(__dirname, "public", "index.html");
const DEFAULT_PORT = 3000;

const config = loadConfig();

async function readJsonBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  const payload = Buffer.concat(chunks).toString("utf8");
  if (!payload) {
    throw new Error("Request body is required");
  }

  const parsed = JSON.parse(payload);
  if (typeof parsed.prompt !== "string" || parsed.prompt.trim().length === 0) {
    throw new Error("prompt must be a non-empty string");
  }

  return { prompt: parsed.prompt };
}

function sendJson(response, statusCode, body) {
  response.statusCode = statusCode;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.end(JSON.stringify(body));
}

async function handleGenerate(request, response) {
  try {
    const { prompt } = await readJsonBody(request);
    const result = await generateText({ prompt }, config);
    sendJson(response, 200, result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    sendJson(response, 400, { error: message });
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");

  if (request.method === "GET" && url.pathname === "/health") {
    return sendJson(response, 200, { ok: true, provider: config.provider });
  }

  if (request.method === "POST" && url.pathname === "/api/generate") {
    return handleGenerate(request, response);
  }

  if (request.method === "GET" && url.pathname === "/") {
    const html = await readFile(indexHtmlPath, "utf8");
    response.statusCode = 200;
    response.setHeader("content-type", "text/html; charset=utf-8");
    response.end(html);
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
