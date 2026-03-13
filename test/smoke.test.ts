import { afterAll, describe, expect, it } from "vitest";
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";

const TEST_PORT = 43111;
let serverProcess: ChildProcessWithoutNullStreams | undefined;

async function waitForServer(url: string): Promise<void> {
  const timeoutAt = Date.now() + 20_000;

  while (Date.now() < timeoutAt) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // server still booting
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  throw new Error(`Timed out waiting for server at ${url}`);
}

describe("web example smoke", () => {
  it("starts and responds to /health in mock mode", async () => {
    serverProcess = spawn("pnpm", ["dev"], {
      env: {
        ...process.env,
        PORT: String(TEST_PORT),
        WEB_PROVIDER: "mock",
      },
    });

    serverProcess.stderr.on("data", (chunk) => {
      process.stderr.write(chunk);
    });

    await waitForServer(`http://127.0.0.1:${TEST_PORT}/health`);

    const healthResponse = await fetch(`http://127.0.0.1:${TEST_PORT}/health`);
    const healthJson = (await healthResponse.json()) as { ok: boolean; provider: string };

    expect(healthResponse.status).toBe(200);
    expect(healthJson).toEqual({ ok: true, provider: "mock" });

    const generateResponse = await fetch(
      `http://127.0.0.1:${TEST_PORT}/api/generate`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt: "hello from smoke test" }),
      },
    );

    const generateJson = (await generateResponse.json()) as {
      text: string;
      metadata: { provider: string };
    };

    expect(generateResponse.status).toBe(200);
    expect(generateJson.metadata.provider).toBe("mock");
    expect(generateJson.text).toContain("hello from smoke test");
  });
});

afterAll(() => {
  if (serverProcess && !serverProcess.killed) {
    serverProcess.kill("SIGTERM");
  }
});
