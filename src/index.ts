import type { ProviderName } from "./providers/types.js";

export { loadConfig, type LLMConfig } from "./config/loadConfig.js";
export { generateText } from "./generateText.js";
export { getPrompt, promptRegistry, renderPrompt } from "./prompts/registry.js";
export type {
  PromptArgs,
  PromptBuilder,
  PromptDefinition,
  PromptRegistry,
} from "./prompts/types.js";
export { summarizePrompt } from "./prompts/summarize.js";
export type { SummarizePromptArgs } from "./prompts/summarize.js";
export {
  createProvider,
  providerRegistry,
  resolveProviderName,
} from "./providers/router.js";
export type {
  GenerateTextInput,
  GenerateTextOutput,
  LLMProvider,
} from "./providers/types.js";

export type ProviderKey = Extract<ProviderName, "huggingface" | "replicate">;

export interface StarterKitInfo {
  name: string;
  supportedProviders: ProviderKey[];
  networkMode: "mock-only";
}

export function getStarterKitInfo(): StarterKitInfo {
  return {
    name: "byo-llm-kit",
    supportedProviders: ["huggingface", "replicate"],
    networkMode: "mock-only",
  };
}
