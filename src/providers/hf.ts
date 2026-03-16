import { createHash } from "node:crypto";
import {
  type GenerateTextInput,
  type GenerateTextOutput,
  type LLMProvider,
} from "./types.js";
import { redactErrorMessage } from "../security/redactSecrets.js";

const DEFAULT_MAX_TOKENS = 128;
const DEFAULT_TEMPERATURE = 0;

export interface HFTextGenerationClient {
  textGeneration(request: {
    model: string;
    inputs: string;
    parameters: {
      max_new_tokens: number;
      temperature: number;
      return_full_text: boolean;
    };
    provider?: string;
  }): Promise<string | { generated_text?: string }>;
}

export interface HuggingFaceProviderOptions {
  token?: string;
  model?: string;
  provider?: string;
  client?: HFTextGenerationClient;
}

export class HuggingFaceProvider implements LLMProvider {
  readonly name = "huggingface" as const;

  private readonly token?: string;
  private readonly defaultModel?: string;
  private readonly provider?: string;
  private readonly client?: HFTextGenerationClient;

  constructor(options: HuggingFaceProviderOptions = {}) {
    this.assertServerRuntime();
    this.token = options.token ?? process.env.HF_TOKEN;
    this.defaultModel = options.model ?? process.env.HF_MODEL;
    this.provider = options.provider ?? process.env.HF_PROVIDER;
    this.client = options.client;
  }

  async generateText(input: GenerateTextInput): Promise<GenerateTextOutput> {
    this.assertServerRuntime();

    if (!this.token) {
      throw new Error("HF_TOKEN is required for Hugging Face provider");
    }

    const model = input.model ?? this.defaultModel;
    if (!model) {
      throw new Error("HF_MODEL is required when model is not provided");
    }

    const maxTokens = input.maxTokens ?? DEFAULT_MAX_TOKENS;
    const temperature = input.temperature ?? DEFAULT_TEMPERATURE;
    const responseText = await this.callTextGeneration({
      model,
      prompt: input.prompt,
      maxTokens,
      temperature,
      provider: this.provider,
    });

    const promptHash = createHash("sha256")
      .update(`${input.prompt}|${model}|${maxTokens}|${temperature}`)
      .digest("hex")
      .slice(0, 16);

    return {
      text: responseText,
      metadata: {
        provider: this.name,
        model,
        promptHash,
        maxTokens,
        temperature,
      },
    };
  }

  private async callTextGeneration(params: {
    model: string;
    prompt: string;
    maxTokens: number;
    temperature: number;
    provider?: string;
  }): Promise<string> {
    const client = await this.resolveClient();

    try {
      const response = await client.textGeneration({
        model: params.model,
        inputs: params.prompt,
        parameters: {
          max_new_tokens: params.maxTokens,
          temperature: params.temperature,
          return_full_text: false,
        },
        provider: params.provider,
      });

      if (typeof response === "string") {
        return response;
      }

      if (typeof response.generated_text === "string") {
        return response.generated_text;
      }

      throw new Error(
        "Hugging Face returned an invalid text generation response",
      );
    } catch (error) {
      throw new Error(
        `Hugging Face text generation failed: ${redactErrorMessage(error)}`,
      );
    }
  }

  private async resolveClient(): Promise<HFTextGenerationClient> {
    if (this.client) {
      return this.client;
    }

    const hfModule = (await import("@huggingface/inference")) as {
      InferenceClient: new (token: string) => HFTextGenerationClient;
    };

    return new hfModule.InferenceClient(this.token as string);
  }

  private assertServerRuntime(): void {
    if (typeof window !== "undefined") {
      throw new Error(
        "HuggingFaceProvider is server-only and cannot run in browser bundles",
      );
    }
  }
}
