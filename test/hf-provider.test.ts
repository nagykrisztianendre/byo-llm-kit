import { describe, expect, it, vi } from "vitest";
import { HuggingFaceProvider, type HFTextGenerationClient } from "../src/providers/hf.js";

describe("HuggingFaceProvider", () => {
  it("sends text generation request with expected shape", async () => {
    const textGeneration = vi
      .fn<HFTextGenerationClient["textGeneration"]>()
      .mockResolvedValue({ generated_text: "hi from hf" });

    const provider = new HuggingFaceProvider({
      token: "hf_test_token",
      model: "meta-llama/Llama-3.1-8B-Instruct",
      provider: "nebius",
      client: { textGeneration },
    });

    const output = await provider.generateText({
      prompt: "Say hi",
      maxTokens: 42,
      temperature: 0.4,
    });

    expect(textGeneration).toHaveBeenCalledWith({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      inputs: "Say hi",
      parameters: {
        max_new_tokens: 42,
        temperature: 0.4,
        return_full_text: false,
      },
      provider: "nebius",
    });

    expect(output.text).toBe("hi from hf");
    expect(output.metadata.provider).toBe("huggingface");
  });

  it("wraps and surfaces upstream client errors", async () => {
    const provider = new HuggingFaceProvider({
      token: "hf_test_token",
      model: "test-model",
      client: {
        textGeneration: vi
          .fn<HFTextGenerationClient["textGeneration"]>()
          .mockRejectedValue(new Error("rate limited")),
      },
    });

    await expect(provider.generateText({ prompt: "hello" })).rejects.toThrow(
      "Hugging Face text generation failed: rate limited",
    );
  });
});
