import { generateText, loadConfig } from "../../../../../src/index.js";
import type { ProviderName } from "../../../../../src/providers/types.js";

interface GenerateBody {
  prompt?: unknown;
  provider?: unknown;
}

function parseBody(body: GenerateBody): {
  prompt: string;
  provider: ProviderName;
} {
  if (typeof body.prompt !== "string" || body.prompt.trim().length === 0) {
    throw new Error("prompt must be a non-empty string");
  }

  const provider = body.provider ?? "mock";
  if (
    provider !== "mock" &&
    provider !== "huggingface" &&
    provider !== "replicate"
  ) {
    throw new Error("provider must be one of: mock, huggingface, replicate");
  }

  return {
    prompt: body.prompt,
    provider,
  };
}

export async function generateFromRequest(body: GenerateBody) {
  const { prompt, provider } = parseBody(body);
  const result = await generateText(
    { prompt },
    {
      ...loadConfig(),
      provider,
    },
  );

  return {
    text: result.text,
    metadata: {
      provider: result.metadata.provider,
      model: result.metadata.model,
    },
  };
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as GenerateBody;
    const payload = await generateFromRequest(body);

    return Response.json(payload, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "generation failed";
    return Response.json({ error: message }, { status: 400 });
  }
}
