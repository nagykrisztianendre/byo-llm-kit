import { describe, expect, it } from "vitest";
import {
  redactErrorMessage,
  redactSecrets,
} from "../../src/security/redactSecrets.js";

describe("redactSecrets", () => {
  it("redacts known token formats", () => {
    const input = "hf_12345678 and r8_abcd1234 and Bearer supersecretvalue";

    const output = redactSecrets(input);

    expect(output).not.toContain("hf_12345678");
    expect(output).not.toContain("r8_abcd1234");
    expect(output).not.toContain("supersecretvalue");
    expect(output).toContain("[REDACTED]");
  });

  it("redacts env assignment values", () => {
    const output = redactSecrets(
      "HF_TOKEN=hf_12345678 REPLICATE_API_TOKEN = r8_abcd1234",
    );

    expect(output).toContain("HF_TOKEN=[REDACTED]");
    expect(output).toContain("REPLICATE_API_TOKEN = [REDACTED]");
  });

  it("sanitizes unknown errors via redactErrorMessage", () => {
    const output = redactErrorMessage("auth failed with sk_12345678");

    expect(output).not.toContain("sk_12345678");
    expect(output).toContain("[REDACTED]");
  });
});
