import { describe, expect, it } from "vitest";
import {
  POST,
  generateFromRequest,
} from "../examples/nextjs/app/api/generate/route.js";

describe("nextjs example /api/generate", () => {
  it("returns deterministic mock output from helper", async () => {
    const first = await generateFromRequest({
      prompt: "Summarize BYO-LLM kit benefits.",
      provider: "mock",
    });
    const second = await generateFromRequest({
      prompt: "Summarize BYO-LLM kit benefits.",
      provider: "mock",
    });

    expect(first).toEqual(second);
    expect(first.metadata.provider).toBe("mock");
    expect(first.text).toMatch(/^mock:[a-f0-9]{16}:/);
  });

  it("handles POST requests and returns provider metadata", async () => {
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        prompt: "Write a short summary.",
        provider: "mock",
      }),
    });

    const response = await POST(request);
    const payload = (await response.json()) as {
      text: string;
      metadata: { provider: string; model: string };
    };

    expect(response.status).toBe(200);
    expect(payload.metadata.provider).toBe("mock");
    expect(payload.metadata.model).toBeTypeOf("string");
    expect(payload.text).toMatch(/^mock:[a-f0-9]{16}:/);
  });
});
