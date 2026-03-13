import { describe, expect, it } from "vitest";
import { generateText } from "../src/index.js";

describe("mock provider", () => {
  it("returns deterministic output for the same input", async () => {
    const input = {
      prompt: "Summarize BYO-LLM kit",
      model: "mock-llm-v1",
      maxTokens: 64,
      temperature: 0,
    };

    const first = await generateText(input);
    const second = await generateText(input);

    expect(first).toEqual(second);
  });

  it("includes required metadata fields", async () => {
    const output = await generateText({ prompt: "Hello world" });

    expect(output.text).toBeTypeOf("string");
    expect(output.metadata.provider).toBe("mock");
    expect(output.metadata.model).toBeTypeOf("string");
    expect(output.metadata.promptHash).toMatch(/^[a-f0-9]{16}$/);
    expect(output.metadata.maxTokens).toBeTypeOf("number");
    expect(output.metadata.temperature).toBeTypeOf("number");
  });
});
