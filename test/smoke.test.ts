import { describe, expect, it } from "vitest";
import { getStarterKitInfo } from "../src/index.js";

describe("starter kit scaffold", () => {
  it("runs tests in deterministic mock-only mode", () => {
    const info = getStarterKitInfo();

    expect(info.name).toBe("byo-llm-kit");
    expect(info.supportedProviders).toEqual(["huggingface", "replicate"]);
    expect(info.networkMode).toBe("mock-only");
  });
});
