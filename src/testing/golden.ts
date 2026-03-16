import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export function loadGoldenFixture<TFixture>(fixturePath: string): TFixture {
  const absolutePath = resolve(process.cwd(), fixturePath);
  const rawFixture = readFileSync(absolutePath, "utf8");
  return JSON.parse(rawFixture) as TFixture;
}

export function assertGoldenMatch(
  actual: unknown,
  expected: unknown,
  context = "value",
): void {
  const mismatches = collectMismatches(actual, expected, context);

  if (mismatches.length > 0) {
    throw new Error(
      [
        `Golden assertion failed with ${mismatches.length} mismatch(es):`,
        ...mismatches.map((mismatch) => `- ${mismatch}`),
      ].join("\n"),
    );
  }
}

export function assertTextContains(
  actual: string,
  expectedSnippets: string[],
  context = "text",
): void {
  const missing = expectedSnippets.filter(
    (snippet) => !actual.includes(snippet),
  );

  if (missing.length > 0) {
    throw new Error(
      [
        `Golden assertion failed for ${context}. Missing ${missing.length} snippet(s):`,
        ...missing.map((snippet) => `- ${JSON.stringify(snippet)}`),
        `Actual value: ${JSON.stringify(actual)}`,
      ].join("\n"),
    );
  }
}

function collectMismatches(
  actual: unknown,
  expected: unknown,
  context: string,
): string[] {
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual)) {
      return [`${context}: expected an array but got ${describeValue(actual)}`];
    }

    const mismatches: string[] = [];
    for (let index = 0; index < expected.length; index += 1) {
      mismatches.push(
        ...collectMismatches(
          actual[index],
          expected[index],
          `${context}[${index}]`,
        ),
      );
    }
    return mismatches;
  }

  if (isRecord(expected)) {
    if (!isRecord(actual)) {
      return [
        `${context}: expected an object but got ${describeValue(actual)}`,
      ];
    }

    const mismatches: string[] = [];
    for (const [key, expectedValue] of Object.entries(expected)) {
      mismatches.push(
        ...collectMismatches(actual[key], expectedValue, `${context}.${key}`),
      );
    }
    return mismatches;
  }

  if (actual !== expected) {
    return [
      `${context}: expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`,
    ];
  }

  return [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function describeValue(value: unknown): string {
  if (value === null) {
    return "null";
  }

  if (Array.isArray(value)) {
    return "array";
  }

  return typeof value;
}
