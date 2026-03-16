import { promises as fs } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  evaluatePrompt,
  loadEvaluationDataset,
} from "../src/eval/evaluator.js";

describe("evaluator", () => {
  it("runs evaluation in mock mode", async () => {
    const report = await evaluatePrompt({
      promptName: "summarize",
      providers: ["mock"],
      versions: ["v1"],
    });

    expect(report.promptName).toBe("summarize");
    expect(report.cases.length).toBe(1);
    expect(report.cases[0].results[0]).toMatchObject({
      provider: "mock",
      promptVersion: "v1",
      metadata: {
        provider: "mock",
      },
    });
    expect(report.cases[0].results[0].generatedText).toContain("mock:");
  });

  it("loads dataset from file", async () => {
    const dataset = await loadEvaluationDataset("eval-datasets/summarize.json");

    expect(dataset).toHaveLength(2);
    expect(dataset[0].input).toContain("Long article text");
  });

  it("supports exporting result structures as JSON", async () => {
    const report = await evaluatePrompt({
      promptName: "summarize",
      providers: ["mock"],
      versions: ["v1", "v2"],
      inputFile: "eval-datasets/summarize.json",
    });

    const outputPath = join(process.cwd(), ".tmp-eval-report.json");
    await fs.writeFile(outputPath, JSON.stringify(report, null, 2), "utf8");
    const raw = await fs.readFile(outputPath, "utf8");

    const parsed = JSON.parse(raw) as {
      cases: Array<{
        results: Array<{ provider: string; promptVersion: string }>;
      }>;
    };

    expect(parsed.cases[0].results[0]).toMatchObject({
      provider: "mock",
      promptVersion: "v1",
    });

    await fs.unlink(outputPath);
  });
});
