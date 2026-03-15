import { summarizePrompt, type SummarizePromptArgs } from "./summarize.js";
import type { PromptRegistry } from "./types.js";

export const promptRegistry = {
  [summarizePrompt.name]: summarizePrompt,
} as const satisfies PromptRegistry;

export type PromptName = keyof typeof promptRegistry;

type PromptDefinitionByName = (typeof promptRegistry)[PromptName];

interface PromptArgsByName {
  summarize: SummarizePromptArgs;
}

export function getPrompt(name: PromptName): PromptDefinitionByName {
  return promptRegistry[name];
}

export function renderPrompt<TName extends PromptName>(
  name: TName,
  args: PromptArgsByName[TName],
): string {
  return promptRegistry[name].build(args);
}
