import type { IncomingMessage, ServerResponse } from "node:http";
import { loadConfig, type LLMConfig } from "../../../src/config/loadConfig.js";
import {
  createProvider,
  resolveProviderName,
} from "../../../src/providers/router.js";
import type { ProviderName } from "../../../src/providers/types.js";
import { redactErrorMessage } from "../../../src/security/redactSecrets.js";

interface GenerateRequestBody {
  provider: ProviderName;
  prompt: string;
}

function sendJson(
  response: ServerResponse,
  statusCode: number,
  body: unknown,
): void {
  response.statusCode = statusCode;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.end(JSON.stringify(body));
}

async function readJsonBody(
  request: IncomingMessage,
): Promise<GenerateRequestBody> {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  const payload = Buffer.concat(chunks).toString("utf8");
  if (!payload) {
    throw new Error("Request body is required");
  }

  const parsed = JSON.parse(payload) as Partial<GenerateRequestBody>;
  if (typeof parsed.prompt !== "string" || parsed.prompt.trim().length === 0) {
    throw new Error("prompt must be a non-empty string");
  }

  if (typeof parsed.provider !== "string") {
    throw new Error("provider must be provided");
  }

  const provider = resolveProviderName(parsed.provider);

  return {
    provider,
    prompt: parsed.prompt,
  };
}

export async function handleGenerateRequest(
  request: IncomingMessage,
  response: ServerResponse,
  baseConfig: LLMConfig = loadConfig(),
): Promise<void> {
  try {
    const { provider, prompt } = await readJsonBody(request);
    const providerClient = createProvider({
      ...baseConfig,
      provider,
    });
    const result = await providerClient.generateText({ prompt });

    sendJson(response, 200, {
      text: result.text,
      provider: result.metadata.provider,
      model: result.metadata.model,
    });
  } catch (error) {
    sendJson(response, 400, { error: redactErrorMessage(error) });
  }
}
