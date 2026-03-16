import { generateText } from "../generateText.js";
import { loadConfig } from "../config/loadConfig.js";
import {
  getPrompt,
  type PromptName,
  promptRegistry,
} from "../prompts/registry.js";

export interface RunPromptOptions {
  provider?: string;
  model?: string;
  version?: string;
}

export interface CliIO {
  log: (message: string) => void;
  error: (message: string) => void;
}

export function listPromptNames(): PromptName[] {
  return Object.keys(promptRegistry) as PromptName[];
}

export async function runPrompt(
  promptName: string,
  inputText: string,
  options: RunPromptOptions,
): Promise<string> {
  if (!listPromptNames().includes(promptName as PromptName)) {
    throw new Error(
      `Unknown prompt: ${promptName}. Available prompts: ${listPromptNames().join(", ")}`,
    );
  }

  const prompt = getPrompt(promptName as PromptName, options.version);
  const renderedPrompt = prompt.build({ text: inputText } as never);

  const config = loadConfig();
  if (options.provider) {
    config.provider = options.provider;
  }

  const result = await generateText(
    {
      prompt: renderedPrompt,
      model: options.model,
    },
    config,
  );

  return result.text;
}
