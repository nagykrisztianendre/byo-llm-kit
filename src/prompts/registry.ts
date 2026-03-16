import { documentQaV1Prompt, type DocumentQaPromptArgs } from "./documentQa.js";
import {
  emailGeneratorV1Prompt,
  type EmailGeneratorPromptArgs,
} from "./emailGenerator.js";
import {
  productDescriptionV1Prompt,
  type ProductDescriptionPromptArgs,
} from "./productDescription.js";
import {
  summarizeV1Prompt,
  summarizeV2Prompt,
  type SummarizePromptArgs,
} from "./summarize.js";
import type {
  PromptDefinition,
  PromptRegistry,
  PromptVersionRegistry,
} from "./types.js";

export const promptRegistry = {
  summarize: {
    [summarizeV1Prompt.version]: summarizeV1Prompt,
    [summarizeV2Prompt.version]: summarizeV2Prompt,
  },
  "email-generator": {
    [emailGeneratorV1Prompt.version]: emailGeneratorV1Prompt,
  },
  "product-description": {
    [productDescriptionV1Prompt.version]: productDescriptionV1Prompt,
  },
  "document-qa": {
    [documentQaV1Prompt.version]: documentQaV1Prompt,
  },
} as const satisfies PromptRegistry;

export type PromptName = keyof typeof promptRegistry;

type PromptDefinitionByName = (typeof promptRegistry)[PromptName][string];

export interface PromptArgsByName {
  summarize: SummarizePromptArgs;
  "email-generator": EmailGeneratorPromptArgs;
  "product-description": ProductDescriptionPromptArgs;
  "document-qa": DocumentQaPromptArgs;
}

function resolveLatestVersion(versions: PromptVersionRegistry): string {
  const versionKeys = Object.keys(versions);
  if (versionKeys.length === 0) {
    throw new Error("Prompt has no registered versions");
  }

  const sorted = [...versionKeys].sort((left, right) => {
    const leftMatch = /^v(\d+)$/.exec(left);
    const rightMatch = /^v(\d+)$/.exec(right);

    if (leftMatch && rightMatch) {
      return Number(leftMatch[1]) - Number(rightMatch[1]);
    }

    return left.localeCompare(right, undefined, { numeric: true });
  });

  return sorted[sorted.length - 1];
}

export function listPromptVersions(name: PromptName): string[] {
  return Object.keys(promptRegistry[name]);
}

export function getPrompt(
  name: PromptName,
  version = "latest",
): PromptDefinitionByName {
  const versions = promptRegistry[name];
  const resolvedVersion =
    version === "latest" ? resolveLatestVersion(versions) : version;
  const prompt = versions[resolvedVersion];

  if (!prompt) {
    throw new Error(
      `Unknown prompt version: ${name}@${version}. Available versions: ${Object.keys(versions).join(", ")}`,
    );
  }

  return prompt;
}

export function renderPrompt<TName extends PromptName>(
  name: TName,
  args: PromptArgsByName[TName],
  version = "latest",
): string {
  return getPrompt(name, version).build(args as never);
}

export function getLatestPromptVersion(name: PromptName): string {
  return resolveLatestVersion(promptRegistry[name]);
}

export function listPromptDefinitions(
  name: PromptName,
): PromptDefinition<string, any>[] {
  return Object.values(promptRegistry[name]);
}
