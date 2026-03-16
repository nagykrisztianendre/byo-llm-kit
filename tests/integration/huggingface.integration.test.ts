import { describe, expect, it } from "vitest";
import { HuggingFaceProvider } from "../../src/providers/hf.js";

const HF_TOKEN = process.env.HF_TOKEN;
const HF_MODEL = process.env.HF_MODEL ?? "gpt2";
const HF_PROVIDER = process.env.HF_PROVIDER;
const shouldRun = Boolean(HF_TOKEN);

describe("Hugging Face integration", () => {
  it.skipIf(!shouldRun)(
    "instantiates provider and generates text with valid output shape",
    async () => {
      const provider = new HuggingFaceProvider({
        token: HF_TOKEN,
        model: HF_MODEL,
        provider: HF_PROVIDER,
      });

      const output = await provider.generateText({
        prompt: "Write one short sentence about software testing.",
        maxTokens: 24,
        temperature: 0,
      });

      expect(output.metadata.provider).toBe("huggingface");
      expect(output.metadata.model).toBeTypeOf("string");
      expect(output.metadata.model.length).toBeGreaterThan(0);
      expect(output.text).toBeTypeOf("string");
      expect(output.text.trim().length).toBeGreaterThan(0);
    },
  );

  it("skips cleanly when HF_TOKEN is not configured", () => {
    if (!shouldRun) {
      expect(HF_TOKEN).toBeUndefined();
      return;
    }

    expect(HF_TOKEN).toBeTypeOf("string");
  });
});
