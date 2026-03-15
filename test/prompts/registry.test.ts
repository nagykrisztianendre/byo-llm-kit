import { describe, expect, it } from "vitest";
import {
  getPrompt,
  promptRegistry,
  renderPrompt,
} from "../../src/prompts/registry.js";

describe("prompt registry", () => {
  it("loads discoverable prompts", () => {
    expect(Object.keys(promptRegistry)).toContain("summarize");

    const prompt = getPrompt("summarize");
    expect(prompt.name).toBe("summarize");
    expect(prompt.version).toBe("1.0.0");
  });

  it("renders summarize prompt with expected structure", () => {
    const result = renderPrompt("summarize", {
      text: "BYO-LLM kit provides a provider-agnostic TypeScript scaffold.",
      audience: "product managers",
    });

    expect(result).toContain("You are a concise assistant.");
    expect(result).toContain("Target audience: product managers.");
    expect(result).toContain("Provide a short summary using 3 bullet points.");
    expect(result).toContain("Text to summarize:");
    expect(result).toContain(
      "BYO-LLM kit provides a provider-agnostic TypeScript scaffold.",
    );
  });
});
