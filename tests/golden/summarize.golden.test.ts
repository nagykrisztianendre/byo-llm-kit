import { describe, expect, it } from "vitest";
import { generateText } from "../../src/index.js";
import {
  getPrompt,
  renderPrompt,
  type PromptName,
} from "../../src/prompts/registry.js";
import {
  assertGoldenMatch,
  assertTextContains,
  loadGoldenFixture,
} from "../../src/testing/golden.js";

interface SummarizeGoldenFixture {
  promptName: PromptName;
  promptArgs: {
    text: string;
    audience?: string;
  };
  generation: {
    model: string;
    maxTokens: number;
    temperature: number;
  };
  expected: {
    metadata: {
      provider: "mock";
      model: string;
      maxTokens: number;
      temperature: number;
    };
    textStartsWith: string;
    textContains: string[];
  };
}

describe("summarize prompt golden", () => {
  const fixture = loadGoldenFixture<SummarizeGoldenFixture>(
    "tests/fixtures/prompts/summarize.json",
  );

  it("resolves summarize prompt from registry", () => {
    const prompt = getPrompt(fixture.promptName);

    expect(prompt.name).toBe("summarize");
    expect(prompt.version).toBe("v2");
  });

  it("matches expected output structure in mock mode", async () => {
    const prompt = renderPrompt(fixture.promptName, fixture.promptArgs);
    const output = await generateText({
      prompt,
      ...fixture.generation,
    });

    expect(output.text.startsWith(fixture.expected.textStartsWith)).toBe(true);
    assertTextContains(
      output.text,
      fixture.expected.textContains,
      "output.text",
    );
    assertGoldenMatch(
      output.metadata,
      fixture.expected.metadata,
      "output.metadata",
    );
  });

  it("emits readable assertion failures", () => {
    expect(() =>
      assertTextContains(
        "mock:123:short output",
        ["Target audience"],
        "output.text",
      ),
    ).toThrowError(/output\.text/);
  });
});
