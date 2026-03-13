import { MockProvider } from "./providers/mock.js";
import type {
  GenerateTextInput,
  GenerateTextOutput,
  ProviderName,
} from "./providers/types.js";

export type ProviderKey = Extract<ProviderName, "huggingface" | "replicate">;

export interface StarterKitInfo {
  name: string;
  supportedProviders: ProviderKey[];
  networkMode: "mock-only";
}

const mockProvider = new MockProvider();

export function getStarterKitInfo(): StarterKitInfo {
  return {
    name: "byo-llm-kit",
    supportedProviders: ["huggingface", "replicate"],
    networkMode: "mock-only",
  };
}

export async function generateText(
  input: GenerateTextInput,
): Promise<GenerateTextOutput> {
  return mockProvider.generateText(input);
}
