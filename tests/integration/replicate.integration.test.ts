import { describe, expect, it } from "vitest";
import { ReplicateProvider } from "../../src/providers/replicate.js";

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const REPLICATE_MODEL =
  process.env.REPLICATE_MODEL ?? "meta/meta-llama-3-8b-instruct";
const shouldRun = Boolean(REPLICATE_API_TOKEN);

describe("Replicate integration", () => {
  it.skipIf(!shouldRun)(
    "instantiates provider and generates text with valid output shape",
    async () => {
      const provider = new ReplicateProvider({
        token: REPLICATE_API_TOKEN,
        model: REPLICATE_MODEL,
      });

      const output = await provider.generateText({
        prompt: "Write one short sentence about software testing.",
        maxTokens: 24,
        temperature: 0,
      });

      expect(output.metadata.provider).toBe("replicate");
      expect(output.metadata.model).toBeTypeOf("string");
      expect(output.metadata.model.length).toBeGreaterThan(0);
      expect(output.text).toBeTypeOf("string");
      expect(output.text.trim().length).toBeGreaterThan(0);
    },
  );

  it("skips cleanly when REPLICATE_API_TOKEN is not configured", () => {
    if (!shouldRun) {
      expect(REPLICATE_API_TOKEN).toBeUndefined();
      return;
    }

    expect(REPLICATE_API_TOKEN).toBeTypeOf("string");
  });
});
