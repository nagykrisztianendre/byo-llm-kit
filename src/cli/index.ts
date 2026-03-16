#!/usr/bin/env node

import { pathToFileURL } from "node:url";
import { runEvaluationCommand } from "../eval/runEvaluation.js";
import { providerRegistry } from "../providers/router.js";
import { listPromptNames, runPrompt, type CliIO } from "./runPrompt.js";
import { runVerifyInstall } from "../../scripts/verify-install.js";

const PROVIDERS = Object.keys(providerRegistry);

interface ParsedRunFlags {
  provider?: string;
  model?: string;
  version?: string;
  tone?: string;
  audience?: string;
  purpose?: string;
  file?: string;
  question?: string;
}

function parseRunFlags(flags: string[]): ParsedRunFlags {
  const parsed: ParsedRunFlags = {};

  for (let index = 0; index < flags.length; index += 1) {
    const flag = flags[index];
    const value = flags[index + 1];

    if (flag === "--provider") {
      parsed.provider = value;
      index += 1;
      continue;
    }

    if (flag === "--model") {
      parsed.model = value;
      index += 1;
      continue;
    }

    if (flag === "--version") {
      parsed.version = value;
      index += 1;
      continue;
    }

    if (flag === "--tone") {
      parsed.tone = value;
      index += 1;
      continue;
    }

    if (flag === "--audience") {
      parsed.audience = value;
      index += 1;
      continue;
    }

    if (flag === "--purpose") {
      parsed.purpose = value;
      index += 1;
      continue;
    }

    if (flag === "--file") {
      parsed.file = value;
      index += 1;
      continue;
    }

    if (flag === "--question") {
      parsed.question = value;
      index += 1;
      continue;
    }

    throw new Error(`Unknown option: ${flag}`);
  }

  return parsed;
}

function formatHelp(): string {
  return [
    "byo-llm CLI",
    "",
    "Commands:",
    "  byo-llm run <promptName> [inputText] [--version <version>] [--provider <name>] [--model <name>]",
    "  byo-llm run email-generator <request> [--tone <tone>] [--audience <audience>] [--purpose <purpose>]",
    "  byo-llm run document-qa [documentText] [--file <path>] --question <question>",
    "  byo-llm eval <promptName> [--provider <name>] [--version <version>] [--input-file <file>] [--output <file>]",
    "  byo-llm verify",
    "  byo-llm list-prompts",
    "  byo-llm --help",
    "",
    `Available prompts: ${listPromptNames().join(", ")}`,
    `Provider options: ${PROVIDERS.join(", ")}`,
  ].join("\n");
}

function splitRunArgs(args: string[]): {
  inputText?: string;
  flags: string[];
} {
  if (args.length === 0) {
    return { flags: [] };
  }

  if (args[0].startsWith("--")) {
    return { flags: args };
  }

  return {
    inputText: args[0],
    flags: args.slice(1),
  };
}

export async function runCli(
  argv: string[],
  io: CliIO = { log: console.log, error: console.error },
): Promise<number> {
  const [command, ...rest] = argv;

  if (!command || command === "--help" || command === "-h") {
    io.log(formatHelp());
    return 0;
  }

  if (command === "list-prompts") {
    io.log(listPromptNames().join("\n"));
    return 0;
  }

  if (command === "run") {
    const [promptName, ...runArgs] = rest;

    if (!promptName) {
      io.error(
        "Usage: byo-llm run <promptName> [inputText] [--version <version>] [--provider <name>] [--model <name>]",
      );
      return 1;
    }

    try {
      const { inputText, flags } = splitRunArgs(runArgs);
      const parsedFlags = parseRunFlags(flags);
      const output = await runPrompt(promptName, inputText, parsedFlags);
      io.log(output);
      return 0;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      io.error(message);
      return 1;
    }
  }

  if (command === "eval") {
    const [promptName, ...flags] = rest;

    if (!promptName) {
      io.error(
        "Usage: byo-llm eval <promptName> [--provider <name>] [--version <version>] [--input-file <file>] [--output <file>]",
      );
      return 1;
    }

    return runEvaluationCommand(promptName, flags, io);
  }

  if (command === "verify") {
    return runVerifyInstall(io);
  }

  io.error(`Unknown command: ${command}`);
  io.error("Run 'byo-llm --help' to see usage.");
  return 1;
}

const isDirectExecution =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  runCli(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  });
}
