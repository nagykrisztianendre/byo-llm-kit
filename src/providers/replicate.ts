import { createHash } from "node:crypto";
import {
  type GenerateTextInput,
  type GenerateTextOutput,
  type LLMProvider,
} from "./types.js";
import { redactErrorMessage } from "../security/redactSecrets.js";

const DEFAULT_MAX_TOKENS = 128;
const DEFAULT_TEMPERATURE = 0;

export interface ReplicateClient {
  run(
    model: string,
    options: {
      input: {
        prompt: string;
        max_tokens: number;
        temperature: number;
      };
    },
  ): Promise<unknown>;
}

export interface ReplicateProviderOptions {
  token?: string;
  model?: string;
  client?: ReplicateClient;
}

export class ReplicateProvider implements LLMProvider {
  readonly name = "replicate" as const;

  private readonly token?: string;
  private readonly defaultModel?: string;
  private readonly client?: ReplicateClient;

  constructor(options: ReplicateProviderOptions = {}) {
    this.assertServerRuntime();
    this.token = options.token ?? process.env.REPLICATE_API_TOKEN;
    this.defaultModel = options.model ?? process.env.REPLICATE_MODEL;
    this.client = options.client;
  }

  async generateText(input: GenerateTextInput): Promise<GenerateTextOutput> {
    this.assertServerRuntime();

    if (!this.token) {
      throw new Error("REPLICATE_API_TOKEN is required for Replicate provider");
    }

    const model = input.model ?? this.defaultModel;
    if (!model) {
      throw new Error("REPLICATE_MODEL is required when model is not provided");
    }

    const maxTokens = input.maxTokens ?? DEFAULT_MAX_TOKENS;
    const temperature = input.temperature ?? DEFAULT_TEMPERATURE;

    const responseText = await this.callRun({
      model,
      prompt: input.prompt,
      maxTokens,
      temperature,
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

  private async callRun(params: {
    model: string;
    prompt: string;
    maxTokens: number;
    temperature: number;
  }): Promise<string> {
    const client = await this.resolveClient();

    try {
      const response = await client.run(params.model, {
        input: {
          prompt: params.prompt,
          max_tokens: params.maxTokens,
          temperature: params.temperature,
        },
      });

      if (typeof response === "string") {
        return response;
      }

      if (Array.isArray(response)) {
        return response.join("");
      }

      throw new Error("Replicate returned an invalid response");
    } catch (error) {
      throw new Error(
        `Replicate text generation failed: ${redactErrorMessage(error)}`,
      );
    }
  }

  private async resolveClient(): Promise<ReplicateClient> {
    if (this.client) {
      return this.client;
    }

    const replicateModule = (await import("replicate")) as {
      default: new (options: { auth: string }) => ReplicateClient;
    };

    return new replicateModule.default({ auth: this.token as string });
  }

  private assertServerRuntime(): void {
    if (typeof window !== "undefined") {
      throw new Error(
        "ReplicateProvider is server-only and cannot run in browser bundles",
      );
    }
  }
}
