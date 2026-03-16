import { loadConfig, type LLMConfig } from "../config/loadConfig.js";
import { HuggingFaceProvider } from "./hf.js";
import { MockProvider } from "./mock.js";
import { ReplicateProvider } from "./replicate.js";
import type { LLMProvider, ProviderName } from "./types.js";

export type ProviderFactory = (config: LLMConfig) => LLMProvider;

export const providerRegistry: Record<ProviderName, ProviderFactory> = {
  mock: () => new MockProvider(),
  huggingface: (config) =>
    new HuggingFaceProvider({
      token: config.hfToken,
      model: config.hfModel,
    }),
  replicate: (config) =>
    new ReplicateProvider({
      token: config.replicateApiToken,
      model: config.replicateModel,
    }),
};

export function resolveProviderName(provider: string): ProviderName {
  if (provider in providerRegistry) {
    return provider as ProviderName;
  }

  throw new Error(
    `Unsupported LLM provider: ${provider}. Supported providers: ${Object.keys(providerRegistry).join(", ")}`,
  );
}

export function createProvider(
  config: LLMConfig = loadConfig(),
  registry: Record<ProviderName, ProviderFactory> = providerRegistry,
): LLMProvider {
  const providerName = resolveProviderName(config.provider);
  return registry[providerName](config);
}
