import { promises as fs } from "node:fs";
import { performance } from "node:perf_hooks";
import { resolve } from "node:path";
import { loadConfig } from "../config/loadConfig.js";
import { createProvider } from "../providers/router.js";
import { getPrompt, type PromptName } from "../prompts/registry.js";
import type { GenerateTextOutput, ProviderName } from "../providers/types.js";

export interface EvaluationDatasetItem {
  input: string;
}

export interface EvaluationOptions {
  promptName: PromptName;
  providers: ProviderName[];
  versions: string[];
  inputFile?: string;
}

export interface EvaluationResultItem {
  provider: ProviderName;
  promptVersion: string;
  generatedText: string;
  latencyMs: number;
  metadata: GenerateTextOutput["metadata"];
}

export interface EvaluationCaseResult {
  caseIndex: number;
  input: string;
  results: EvaluationResultItem[];
}

export interface EvaluationReport {
  promptName: PromptName;
  inputFile?: string;
  cases: EvaluationCaseResult[];
}

const DEFAULT_DATASET_INPUT =
  "This is a sample article about product updates, team priorities, and user feedback trends over the quarter.";

function assertDatasetShape(value: unknown): EvaluationDatasetItem[] {
  if (!Array.isArray(value)) {
    throw new Error("Evaluation dataset must be a JSON array");
  }

  return value.map((item, index) => {
    if (
      typeof item !== "object" ||
      item === null ||
      typeof (item as { input?: unknown }).input !== "string"
    ) {
      throw new Error(
        `Invalid dataset item at index ${index}. Expected shape: { \"input\": string }`,
      );
    }

    return { input: (item as { input: string }).input };
  });
}

export async function loadEvaluationDataset(
  inputFile?: string,
): Promise<EvaluationDatasetItem[]> {
  if (!inputFile) {
    return [{ input: DEFAULT_DATASET_INPUT }];
  }

  const absolutePath = resolve(process.cwd(), inputFile);
  const raw = await fs.readFile(absolutePath, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  const dataset = assertDatasetShape(parsed);

  if (dataset.length === 0) {
    throw new Error("Evaluation dataset cannot be empty");
  }

  return dataset;
}

export async function evaluatePrompt(
  options: EvaluationOptions,
): Promise<EvaluationReport> {
  const dataset = await loadEvaluationDataset(options.inputFile);

  const cases: EvaluationCaseResult[] = [];

  for (let caseIndex = 0; caseIndex < dataset.length; caseIndex += 1) {
    const item = dataset[caseIndex];
    const caseResults: EvaluationResultItem[] = [];

    for (const version of options.versions) {
      const prompt = getPrompt(options.promptName, version);
      const renderedPrompt = prompt.build({ text: item.input });

      for (const provider of options.providers) {
        const providerConfig = { ...loadConfig(), provider };
        const modelProvider = createProvider(providerConfig);
        const start = performance.now();
        const output = await modelProvider.generateText({
          prompt: renderedPrompt,
        });
        const end = performance.now();

        caseResults.push({
          provider,
          promptVersion: prompt.version,
          generatedText: output.text,
          latencyMs: Math.round((end - start) * 100) / 100,
          metadata: output.metadata,
        });
      }
    }

    cases.push({
      caseIndex,
      input: item.input,
      results: caseResults,
    });
  }

  return {
    promptName: options.promptName,
    inputFile: options.inputFile,
    cases,
  };
}
