import { describe, expect, it } from "vitest";
import {
  getLatestPromptVersion,
  getPrompt,
  listPromptVersions,
  promptRegistry,
  renderPrompt,
} from "../../src/prompts/registry.js";

describe("prompt registry", () => {
  it("loads discoverable prompts", () => {
    expect(Object.keys(promptRegistry)).toEqual(
      expect.arrayContaining([
        "summarize",
        "email-generator",
        "product-description",
        "document-qa",
      ]),
    );

    const prompt = getPrompt("summarize");
    expect(prompt.name).toBe("summarize");
    expect(prompt.version).toBe("v2");
    expect(prompt.description).toContain("key takeaways");
  });

  it("resolves latest version and supports explicit version lookup", () => {
    expect(listPromptVersions("summarize")).toEqual(["v1", "v2"]);
    expect(getLatestPromptVersion("summarize")).toBe("v2");

    const v1Prompt = getPrompt("summarize", "v1");
    expect(v1Prompt.version).toBe("v1");
    expect(v1Prompt.description).toBe("Summarize a long text");
  });

  it("renders summarize prompt with expected structure", () => {
    const result = renderPrompt(
      "summarize",
      {
        text: "BYO-LLM kit provides a provider-agnostic TypeScript scaffold.",
        audience: "product managers",
      },
      "v1",
    );

    expect(result).toContain("You are a concise assistant.");
    expect(result).toContain("Target audience: product managers.");
    expect(result).toContain("Provide a short summary using 3 bullet points.");
    expect(result).toContain("Text to summarize:");
    expect(result).toContain(
      "BYO-LLM kit provides a provider-agnostic TypeScript scaffold.",
    );
  });

  it("renders production use-case prompts", () => {
    expect(
      renderPrompt("email-generator", {
        request: "Write a follow-up email after a job interview",
        tone: "warm",
        audience: "hiring manager",
        purpose: "thank them and restate fit",
      }),
    ).toContain("Subject: <subject line>");

    expect(
      renderPrompt("product-description", {
        productInput: "Wireless headphones with 30h battery",
      }),
    ).toContain("Product details:");

    expect(
      renderPrompt("document-qa", {
        documentText: "Warranty period: 24 months",
        question: "What is the warranty period?",
      }),
    ).toContain("Question:");
  });
});
