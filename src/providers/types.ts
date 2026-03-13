export type ProviderName = "mock" | "huggingface" | "replicate";

export interface GenerateTextInput {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface GenerateTextOutput {
  text: string;
  metadata: {
    provider: ProviderName;
    model: string;
    promptHash: string;
    maxTokens: number;
    temperature: number;
  };
}

export interface LLMProvider {
  readonly name: ProviderName;
  generateText(input: GenerateTextInput): Promise<GenerateTextOutput>;
}
