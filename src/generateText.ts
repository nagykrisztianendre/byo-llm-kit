import type { LLMConfig } from "./config/loadConfig.js";
import { loadConfig } from "./config/loadConfig.js";
import { createProvider } from "./providers/router.js";
import type {
  GenerateTextInput,
  GenerateTextOutput,
} from "./providers/types.js";

export async function generateText(
  input: GenerateTextInput,
  config: LLMConfig = loadConfig(),
): Promise<GenerateTextOutput> {
  const provider = createProvider(config);
  return provider.generateText(input);
}
