import { createHash } from "node:crypto";
import {
  type GenerateTextInput,
  type GenerateTextOutput,
  type LLMProvider,
} from "./types.js";

const DEFAULT_MODEL = "mock-llm-v1";
const DEFAULT_MAX_TOKENS = 128;
const DEFAULT_TEMPERATURE = 0;

export class MockProvider implements LLMProvider {
  readonly name = "mock" as const;

  async generateText(input: GenerateTextInput): Promise<GenerateTextOutput> {
    const model = input.model ?? DEFAULT_MODEL;
    const maxTokens = input.maxTokens ?? DEFAULT_MAX_TOKENS;
    const temperature = input.temperature ?? DEFAULT_TEMPERATURE;
    const seed = `${input.prompt}|${model}|${maxTokens}|${temperature}`;
    const promptHash = createHash("sha256")
      .update(seed)
      .digest("hex")
      .slice(0, 16);

    return {
      text: `mock:${promptHash}:${input.prompt}`,
      metadata: {
        provider: this.name,
        model,
        promptHash,
        maxTokens,
        temperature,
      },
    };
  }
}
