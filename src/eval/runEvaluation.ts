import { promises as fs } from "node:fs";
import { dirname, resolve } from "node:path";
import { listPromptNames, type CliIO } from "../cli/runPrompt.js";
import { resolveProviderName } from "../providers/router.js";
import type { ProviderName } from "../providers/types.js";
import { evaluatePrompt, type EvaluationReport } from "./evaluator.js";

export interface ParsedEvalFlags {
  providers: ProviderName[];
  versions: string[];
  inputFile?: string;
  outputFile?: string;
}

function parseMultiValueFlag(values: string): string[] {
  return values
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

export function parseEvalFlags(flags: string[]): ParsedEvalFlags {
  const providers: ProviderName[] = [];
  const versions: string[] = [];
  let inputFile: string | undefined;
  let outputFile: string | undefined;

  for (let index = 0; index < flags.length; index += 1) {
    const flag = flags[index];
    const value = flags[index + 1];

    if (flag === "--provider") {
      if (!value) {
        throw new Error("--provider requires a value");
      }
      providers.push(
        ...parseMultiValueFlag(value).map((provider) =>
          resolveProviderName(provider),
        ),
      );
      index += 1;
      continue;
    }

    if (flag === "--version") {
      if (!value) {
        throw new Error("--version requires a value");
      }
      versions.push(...parseMultiValueFlag(value));
      index += 1;
      continue;
    }

    if (flag === "--input-file") {
      if (!value) {
        throw new Error("--input-file requires a value");
      }
      inputFile = value;
      index += 1;
      continue;
    }

    if (flag === "--output") {
      if (!value) {
        throw new Error("--output requires a value");
      }
      outputFile = value;
      index += 1;
      continue;
    }

    throw new Error(`Unknown option: ${flag}`);
  }

  return {
    providers: providers.length > 0 ? [...new Set(providers)] : ["mock"],
    versions: versions.length > 0 ? [...new Set(versions)] : ["latest"],
    inputFile,
    outputFile,
  };
}

function formatCaseReport(report: EvaluationReport): string {
  return report.cases
    .map((testCase) => {
      const lines = [
        `Case ${testCase.caseIndex + 1}:`,
        `Input: ${testCase.input}`,
        "",
        "Provider results:",
      ];

      for (const result of testCase.results) {
        lines.push(`${result.provider} (${result.promptVersion}):`);
        lines.push(`  output: ${result.generatedText}`);
        lines.push(`  latency: ${result.latencyMs}ms`);
        lines.push(`  metadata: ${JSON.stringify(result.metadata)}`);
        lines.push("");
      }

      return lines.join("\n").trimEnd();
    })
    .join("\n\n");
}

export function formatEvaluationReport(report: EvaluationReport): string {
  const title = [`Prompt: ${report.promptName}`];

  if (report.inputFile) {
    title.push(`Input file: ${report.inputFile}`);
  }

  return [title.join("\n"), "", formatCaseReport(report)].join("\n");
}

export async function runEvaluationCommand(
  promptName: string,
  flags: string[],
  io: CliIO,
): Promise<number> {
  if (!listPromptNames().includes(promptName as never)) {
    io.error(
      `Unknown prompt: ${promptName}. Available prompts: ${listPromptNames().join(", ")}`,
    );
    return 1;
  }

  try {
    const parsed = parseEvalFlags(flags);
    const report = await evaluatePrompt({
      promptName: promptName as never,
      providers: parsed.providers,
      versions: parsed.versions,
      inputFile: parsed.inputFile,
    });

    io.log(formatEvaluationReport(report));

    if (parsed.outputFile) {
      const outputPath = resolve(process.cwd(), parsed.outputFile);
      await fs.mkdir(dirname(outputPath), { recursive: true });
      await fs.writeFile(
        outputPath,
        `${JSON.stringify(report, null, 2)}\n`,
        "utf8",
      );
      io.log(`Saved evaluation report to ${parsed.outputFile}`);
    }

    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    io.error(message);
    return 1;
  }
}
