import { describe, expect, it } from "vitest";
import { runCli } from "../src/cli/index.js";
import { runVerifyInstall } from "../scripts/verify-install.js";

describe("verify install", () => {
  it("runs verification script successfully", async () => {
    const logs: string[] = [];
    const errors: string[] = [];

    const status = await runVerifyInstall(
      {
        log: (message) => logs.push(message),
        error: (message) => errors.push(message),
      },
      {
        checkNodeVersion: () => {},
        checkPnpm: () => {},
        checkDependencies: () => {},
        runMockPrompt: async () => {},
      },
    );

    expect(status).toBe(0);
    expect(errors).toEqual([]);
    expect(logs).toContain("✔ Node version OK");
    expect(logs).toContain("✔ Dependencies installed");
    expect(logs).toContain("✔ Mock provider working");
    expect(logs).toContain("✔ Prompt execution successful");
    expect(logs).toContain("BYO-LLM Kit is ready.");
  });

  it("supports 'byo-llm verify' command", async () => {
    const logs: string[] = [];
    const errors: string[] = [];

    const status = await runCli(["verify"], {
      log: (message) => logs.push(message),
      error: (message) => errors.push(message),
    });

    expect(status).toBe(0);
    expect(errors).toEqual([]);
    expect(logs).toContain("✔ Mock provider working");
    expect(logs).toContain("✔ Prompt execution successful");
    expect(logs).toContain("BYO-LLM Kit is ready.");
  });
});
