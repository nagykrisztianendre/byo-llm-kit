import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { runCli } from "../src/cli/index.js";

type CapturedLine = { stream: "stdout" | "stderr"; message: string };

function formatSection(
  title: string,
  command: string,
  lines: CapturedLine[],
): string {
  const output =
    lines.length > 0
      ? lines.map((line) => line.message).join("\n")
      : "(no output)";

  return [`## ${title}`, `$ ${command}`, output].join("\n");
}

async function runDemoCommand(argv: string[], displayCommand: string) {
  const lines: CapturedLine[] = [];

  const exitCode = await runCli(argv, {
    log: (message) => lines.push({ stream: "stdout", message }),
    error: (message) => lines.push({ stream: "stderr", message }),
  });

  return {
    exitCode,
    displayCommand,
    lines,
  };
}

async function main() {
  const runDemo = await runDemoCommand(
    ["run", "summarize", "Long article text"],
    'byo-llm run summarize "Long article text"',
  );

  const evalDemo = await runDemoCommand(
    ["eval", "summarize", "--provider", "mock", "--version", "v1"],
    "byo-llm eval summarize --provider mock --version v1",
  );

  const header = [
    "# BYO-LLM demo output",
    `Generated at: ${new Date().toISOString()}`,
    "",
  ].join("\n");

  const body = [
    formatSection("CLI prompt run", runDemo.displayCommand, runDemo.lines),
    "",
    `Exit code: ${runDemo.exitCode}`,
    "",
    formatSection("CLI evaluation", evalDemo.displayCommand, evalDemo.lines),
    "",
    `Exit code: ${evalDemo.exitCode}`,
    "",
  ].join("\n");

  const output = `${header}${body}`;
  const outputPath = resolve(process.cwd(), "demo-output.txt");

  await writeFile(outputPath, output, "utf8");
  process.stdout.write(`${output}\nSaved demo output to demo-output.txt\n`);

  if (runDemo.exitCode !== 0 || evalDemo.exitCode !== 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Failed to generate demo output: ${message}\n`);
  process.exitCode = 1;
});
