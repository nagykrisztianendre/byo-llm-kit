import { promises as fs } from "node:fs";
import { resolve } from "node:path";
import { generateText } from "../generateText.js";
import { loadConfig } from "../config/loadConfig.js";
import {
  getPrompt,
  type PromptArgsByName,
  type PromptName,
  promptRegistry,
} from "../prompts/registry.js";

export interface RunPromptOptions {
  provider?: string;
  model?: string;
  version?: string;
  tone?: string;
  audience?: string;
  purpose?: string;
  file?: string;
  question?: string;
}

export interface CliIO {
  log: (message: string) => void;
  error: (message: string) => void;
}

export function listPromptNames(): PromptName[] {
  return Object.keys(promptRegistry) as PromptName[];
}

async function buildPromptArgs(
  promptName: PromptName,
  inputText: string | undefined,
  options: RunPromptOptions,
): Promise<PromptArgsByName[PromptName]> {
  switch (promptName) {
    case "summarize":
      if (!inputText) {
        throw new Error("summarize requires an input text argument");
      }
      return { text: inputText, audience: options.audience };
    case "email-generator":
      if (!inputText) {
        throw new Error("email-generator requires an input text argument");
      }
      return {
        request: inputText,
        tone: options.tone,
        audience: options.audience,
        purpose: options.purpose,
      };
    case "product-description":
      if (!inputText) {
        throw new Error("product-description requires an input text argument");
      }
      return { productInput: inputText };
    case "document-qa": {
      if (!options.question) {
        throw new Error("document-qa requires --question");
      }

      const documentText = options.file
        ? await fs.readFile(resolve(process.cwd(), options.file), "utf8")
        : inputText;

      if (!documentText) {
        throw new Error("document-qa requires input text or --file");
      }

      return { documentText, question: options.question };
    }
    default:
      throw new Error(`Unsupported prompt: ${promptName}`);
  }
}

export async function runPrompt(
  promptName: string,
  inputText: string | undefined,
  options: RunPromptOptions,
): Promise<string> {
  if (!listPromptNames().includes(promptName as PromptName)) {
    throw new Error(
      `Unknown prompt: ${promptName}. Available prompts: ${listPromptNames().join(", ")}`,
    );
  }

  const typedPromptName = promptName as PromptName;
  const prompt = getPrompt(typedPromptName, options.version);
  const promptArgs = await buildPromptArgs(typedPromptName, inputText, options);
  const renderedPrompt = prompt.build(promptArgs as never);

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
