import { describe, expect, it, vi } from "vitest";
import {
  ReplicateProvider,
  type ReplicateClient,
} from "../../src/providers/replicate.js";

describe("ReplicateProvider", () => {
  it("calls client.run with expected model and input", async () => {
    const run = vi
      .fn<ReplicateClient["run"]>()
      .mockResolvedValue(["hello", " world"]);

    const provider = new ReplicateProvider({
      token: "r8_test_token",
      model: "meta/meta-llama-3-8b-instruct",
      client: { run },
    });

    const output = await provider.generateText({
      prompt: "Say hello",
      maxTokens: 64,
      temperature: 0.2,
    });

    expect(run).toHaveBeenCalledWith("meta/meta-llama-3-8b-instruct", {
      input: {
        prompt: "Say hello",
        max_tokens: 64,
        temperature: 0.2,
      },
    });

    expect(output).toMatchObject({
      text: "hello world",
      metadata: {
        provider: "replicate",
        model: "meta/meta-llama-3-8b-instruct",
        maxTokens: 64,
        temperature: 0.2,
      },
    });
  });

  it("throws when token is missing", async () => {
    const provider = new ReplicateProvider({
      model: "meta/meta-llama-3-8b-instruct",
      client: {
        run: vi.fn<ReplicateClient["run"]>(),
      },
    });

    await expect(provider.generateText({ prompt: "hello" })).rejects.toThrow(
      "REPLICATE_API_TOKEN is required for Replicate provider",
    );
  });

  it("wraps and surfaces upstream client errors", async () => {
    const provider = new ReplicateProvider({
      token: "r8_test_token",
      model: "meta/meta-llama-3-8b-instruct",
      client: {
        run: vi
          .fn<ReplicateClient["run"]>()
          .mockRejectedValue(new Error("provider unavailable")),
      },
    });

    await expect(provider.generateText({ prompt: "hello" })).rejects.toThrow(
      "Replicate text generation failed: provider unavailable",
    );
  });
});
