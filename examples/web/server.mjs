import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { HuggingFaceProvider } from "../../dist/src/providers/hf.js";
import { MockProvider } from "../../dist/src/providers/mock.js";
import { ReplicateProvider } from "../../dist/src/providers/replicate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const indexHtmlPath = join(__dirname, "public", "index.html");
const DEFAULT_PORT = 3000;

function getProviderName() {
  const configured = (process.env.WEB_PROVIDER ?? "mock").toLowerCase();

  if (["huggingface", "replicate", "mock"].includes(configured)) {
    return configured;
  }

  return "mock";
}

function createProvider() {
  const providerName = getProviderName();

  if (providerName === "huggingface") {
    return new HuggingFaceProvider();
  }

  if (providerName === "replicate") {
    return new ReplicateProvider();
  }

  return new MockProvider();
}

const provider = createProvider();

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
    const result = await provider.generateText({ prompt });
    sendJson(response, 200, result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    sendJson(response, 400, { error: message });
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");

  if (request.method === "GET" && url.pathname === "/health") {
    return sendJson(response, 200, { ok: true, provider: provider.name });
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
    `web example listening on http://0.0.0.0:${port} (provider=${provider.name})\n`,
  );
});
