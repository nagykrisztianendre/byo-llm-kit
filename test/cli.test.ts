import { promises as fs } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import { runCli } from "../src/cli/index.js";

const originalEnv = { ...process.env };
const EVAL_OUTPUT_FILE = ".tmp-cli-eval-report.json";

afterEach(async () => {
  process.env = { ...originalEnv };

  await fs.rm(EVAL_OUTPUT_FILE, { force: true });
});

describe("CLI", () => {
  it("runs summarize prompt in mock mode by default", async () => {
    delete process.env.LLM_PROVIDER;

    const logs: string[] = [];
    const errors: string[] = [];

    const status = await runCli(["run", "summarize", "Long text"], {
      log: (message) => logs.push(message),
      error: (message) => errors.push(message),
    });

    expect(status).toBe(0);
    expect(errors).toEqual([]);
    expect(logs[0]).toContain("mock:");
    expect(logs[0]).toContain("Text to summarize:");
    expect(logs[0]).toContain("Long text");
  });

  it("runs production use-case prompts in mock mode", async () => {
    const emailLogs: string[] = [];
    const emailErrors: string[] = [];

    const emailStatus = await runCli(
      [
        "run",
        "email-generator",
        "Write a follow-up email after a job interview",
        "--tone",
        "warm",
        "--audience",
        "hiring manager",
        "--purpose",
        "thank them and restate fit",
      ],
      {
        log: (message) => emailLogs.push(message),
        error: (message) => emailErrors.push(message),
      },
    );

    expect(emailStatus).toBe(0);
    expect(emailErrors).toEqual([]);
    expect(emailLogs[0]).toContain("mock:");
    expect(emailLogs[0]).toContain("Tone: warm.");

    const productLogs: string[] = [];
    const productErrors: string[] = [];

    const productStatus = await runCli(
      ["run", "product-description", "Wireless headphones with 30h battery"],
      {
        log: (message) => productLogs.push(message),
        error: (message) => productErrors.push(message),
      },
    );

    expect(productStatus).toBe(0);
    expect(productErrors).toEqual([]);
    expect(productLogs[0]).toContain("Product details:");

    const docLogs: string[] = [];
    const docErrors: string[] = [];

    const docStatus = await runCli(
      [
        "run",
        "document-qa",
        "--file",
        "examples/use-cases/document-qa/example-doc.txt",
        "--question",
        "What is the warranty period?",
      ],
      {
        log: (message) => docLogs.push(message),
        error: (message) => docErrors.push(message),
      },
    );

    expect(docStatus).toBe(0);
    expect(docErrors).toEqual([]);
    expect(docLogs[0]).toContain("Question:");
    expect(docLogs[0]).toContain("What is the warranty period?");
  });

  it("lists prompts", async () => {
    const logs: string[] = [];
    const errors: string[] = [];

    const status = await runCli(["list-prompts"], {
      log: (message) => logs.push(message),
      error: (message) => errors.push(message),
    });

    expect(status).toBe(0);
    expect(errors).toEqual([]);
    expect(logs[0]).toContain("summarize");
    expect(logs[0]).toContain("email-generator");
    expect(logs[0]).toContain("product-description");
    expect(logs[0]).toContain("document-qa");
  });

  it("applies provider flag override", async () => {
    process.env.LLM_PROVIDER = "replicate";

    const logs: string[] = [];
    const errors: string[] = [];

    const status = await runCli(
      ["run", "summarize", "test text", "--provider", "mock"],
      {
        log: (message) => logs.push(message),
        error: (message) => errors.push(message),
      },
    );

    expect(status).toBe(0);
    expect(errors).toEqual([]);
    expect(logs[0]).toContain("mock:");
  });

  it("supports --version flag", async () => {
    const logs: string[] = [];
    const errors: string[] = [];

    const status = await runCli(
      ["run", "summarize", "versioned text", "--version", "v1"],
      {
        log: (message) => logs.push(message),
        error: (message) => errors.push(message),
      },
    );

    expect(status).toBe(0);
    expect(errors).toEqual([]);
    expect(logs[0]).toContain("Provide a short summary using 3 bullet points.");
  });

  it("runs eval command for summarize prompt", async () => {
    const logs: string[] = [];
    const errors: string[] = [];

    const status = await runCli(
      ["eval", "summarize", "--provider", "mock", "--version", "v1"],
      {
        log: (message) => logs.push(message),
        error: (message) => errors.push(message),
      },
    );

    expect(status).toBe(0);
    expect(errors).toEqual([]);
    expect(logs[0]).toContain("Prompt: summarize");
    expect(logs[0]).toContain("mock (v1)");
    expect(logs[0]).toContain("metadata:");
  });

  it("supports eval dataset file and output export", async () => {
    const logs: string[] = [];
    const errors: string[] = [];

    const status = await runCli(
      [
        "eval",
        "summarize",
        "--provider",
        "mock",
        "--version",
        "v1",
        "--input-file",
        "eval-datasets/summarize.json",
        "--output",
        EVAL_OUTPUT_FILE,
      ],
      {
        log: (message) => logs.push(message),
        error: (message) => errors.push(message),
      },
    );

    expect(status).toBe(0);
    expect(errors).toEqual([]);
    expect(logs[0]).toContain("Input file: eval-datasets/summarize.json");
    expect(logs[1]).toContain("Saved evaluation report");

    const written = await fs.readFile(EVAL_OUTPUT_FILE, "utf8");
    const parsed = JSON.parse(written) as { promptName: string };
    expect(parsed.promptName).toBe("summarize");
  });
});
