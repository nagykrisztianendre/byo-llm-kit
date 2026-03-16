import { afterEach, describe, expect, it } from "vitest";
import { runCli } from "../src/cli/index.js";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
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

  it("lists prompts", async () => {
    const logs: string[] = [];
    const errors: string[] = [];

    const status = await runCli(["list-prompts"], {
      log: (message) => logs.push(message),
      error: (message) => errors.push(message),
    });

    expect(status).toBe(0);
    expect(errors).toEqual([]);
    expect(logs).toEqual(["summarize"]);
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
});
