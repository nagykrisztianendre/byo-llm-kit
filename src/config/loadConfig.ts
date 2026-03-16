export interface LLMConfig {
  provider: string;
  hfToken?: string;
  hfModel?: string;
  replicateApiToken?: string;
  replicateModel?: string;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): LLMConfig {
  return {
    provider: (env.LLM_PROVIDER ?? "mock").toLowerCase(),
    hfToken: env.HF_TOKEN,
    hfModel: env.HF_MODEL,
    replicateApiToken: env.REPLICATE_API_TOKEN,
    replicateModel: env.REPLICATE_MODEL,
  };
}
