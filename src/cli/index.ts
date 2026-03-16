#!/usr/bin/env node

import { pathToFileURL } from "node:url";
import { providerRegistry } from "../providers/router.js";
import { listPromptNames, runPrompt, type CliIO } from "./runPrompt.js";

const PROVIDERS = Object.keys(providerRegistry);

interface ParsedRunFlags {
  provider?: string;
  model?: string;
}

function parseRunFlags(flags: string[]): ParsedRunFlags {
  const parsed: ParsedRunFlags = {};

  for (let index = 0; index < flags.length; index += 1) {
    const flag = flags[index];

    if (flag === "--provider") {
      parsed.provider = flags[index + 1];
      index += 1;
      continue;
    }

    if (flag === "--model") {
      parsed.model = flags[index + 1];
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
    "  byo-llm run <promptName> <inputText> [--provider <name>] [--model <name>]",
    "  byo-llm list-prompts",
    "  byo-llm --help",
    "",
    `Available prompts: ${listPromptNames().join(", ")}`,
    `Provider options: ${PROVIDERS.join(", ")}`,
  ].join("\n");
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
    const [promptName, inputText, ...flags] = rest;

    if (!promptName || !inputText) {
      io.error(
        "Usage: byo-llm run <promptName> <inputText> [--provider <name>] [--model <name>]",
      );
      return 1;
    }

    try {
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
