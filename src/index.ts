export type ProviderKey = 'huggingface' | 'replicate';

export interface StarterKitInfo {
  name: string;
  supportedProviders: ProviderKey[];
  networkMode: 'mock-only';
}

export function getStarterKitInfo(): StarterKitInfo {
  return {
    name: 'byo-llm-kit',
    supportedProviders: ['huggingface', 'replicate'],
    networkMode: 'mock-only'
  };
}
