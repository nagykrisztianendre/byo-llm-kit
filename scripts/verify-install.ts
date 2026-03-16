import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { generateText } from "../src/generateText.js";

export interface VerifyIO {
  log: (message: string) => void;
  error: (message: string) => void;
}

interface VerifyDeps {
  checkNodeVersion: () => void;
  checkPnpm: () => void;
  checkDependencies: () => void;
  runMockPrompt: () => Promise<void>;
}

const require = createRequire(import.meta.url);

function checkNodeVersion(version: string = process.versions.node): void {
  const majorVersion = Number.parseInt(version.split(".")[0] ?? "0", 10);

  if (!Number.isFinite(majorVersion) || majorVersion < 20) {
    throw new Error(`Node.js 20+ is required. Detected ${version}.`);
  }
}

function checkPnpm(): void {
  const result = spawnSync("pnpm", ["--version"], {
    stdio: "ignore",
  });

  if (result.status !== 0) {
    throw new Error("pnpm is not available on PATH.");
  }
}

function checkDependencies(): void {
  require.resolve("typescript/package.json");
  require.resolve("vitest/package.json");
}

async function runMockPrompt(): Promise<void> {
  const result = await generateText(
    { prompt: "Quickstart verification prompt" },
    { provider: "mock" },
  );

  if (!result.text.includes("mock:")) {
    throw new Error("Mock provider did not return expected output.");
  }
}

export async function runVerifyInstall(
  io: VerifyIO = {
    log: console.log,
    error: console.error,
  },
  deps: VerifyDeps = {
    checkNodeVersion,
    checkPnpm,
    checkDependencies,
    runMockPrompt,
  },
): Promise<number> {
  try {
    deps.checkNodeVersion();
    io.log("✔ Node version OK");

    deps.checkPnpm();
    io.log("✔ pnpm available");

    deps.checkDependencies();
    io.log("✔ Dependencies installed");

    await deps.runMockPrompt();
    io.log("✔ Mock provider working");
    io.log("✔ Prompt execution successful");
    io.log("BYO-LLM Kit is ready.");
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    io.error(`✖ Verification failed: ${message}`);
    return 1;
  }
}

const isDirectExecution =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  runVerifyInstall().then((code) => {
    process.exitCode = code;
  });
}
