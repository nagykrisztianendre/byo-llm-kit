import { afterEach, describe, expect, it } from "vitest";
import { generateText } from "../src/generateText.js";
import { createProvider } from "../src/providers/router.js";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("provider router", () => {
  it("selects mock provider by default", async () => {
    delete process.env.LLM_PROVIDER;

    const output = await generateText({ prompt: "default provider" });

    expect(output.metadata.provider).toBe("mock");
  });

  it("selects Hugging Face provider when configured", () => {
    process.env.LLM_PROVIDER = "huggingface";

    const provider = createProvider();

    expect(provider.name).toBe("huggingface");
  });

  it("throws for unsupported provider", () => {
    process.env.LLM_PROVIDER = "unknown-provider";

    expect(() => createProvider()).toThrow("Unsupported LLM provider");
  });
});
