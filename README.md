# BYO-LLM Kit — No Vendor Lock-in

## What this project is

A developer-focused template repository for building AI-powered SaaS features in
Node.js + TypeScript with provider flexibility.

## Why BYO-LLM

- Avoid coupling your app to one inference provider.
- Keep feature code stable while changing providers.
- Control costs and quality by selecting providers per use case.
- Use deterministic mock mode for fast local development and CI.

## Features

- Node.js 20 + pnpm + TypeScript baseline
- Provider-agnostic adapter architecture
- Zero-inference mock mode
- Minimal web example with server-side provider calls
- GitHub Codespaces devcontainer
- CI checks: lint, typecheck, test, build

## Quickstart

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Run the web example in Codespaces

The repository now includes a single-screen web demo in `examples/web`.

```bash
pnpm install
pnpm dev
```

Open the forwarded port (default `3000`) and use the form:

- Enter prompt text
- Submit
- View generated output

Provider calls are made server-side only via `POST /api/generate`.

### Mock mode by default (no keys required)

By default, `pnpm dev` uses `WEB_PROVIDER=mock`, so the demo works with zero
configuration and no external network calls.

### Switch providers later

To switch to Hugging Face:

```bash
WEB_PROVIDER=huggingface HF_TOKEN=... HF_MODEL=... pnpm dev
```

To switch to Replicate:

```bash
WEB_PROVIDER=replicate REPLICATE_API_TOKEN=... REPLICATE_MODEL=... pnpm dev
```

These providers are server-side adapters and should not be used in browser code.

## Health endpoint and smoke test

The example server exposes `GET /health` and returns a JSON success payload.

A smoke test in `test/smoke.test.ts` starts the example server with mock mode,
hits `/health`, and then posts to `/api/generate` to verify end-to-end flow
without external network calls.

## Package manager policy

This repository is intentionally pinned to **pnpm** (see `packageManager` in
`package.json`) to keep local and CI behavior consistent.

- Use `pnpm` for dependency installation and all project scripts.
- `npm`/`yarn` are not supported workflow targets for this starter kit.

## Example usage

```ts
import { getStarterKitInfo } from "./src/index.js";

const info = getStarterKitInfo();
console.log(info);
```

## Supported providers

- Hugging Face (`src/providers/hf.ts`)
- Replicate (`src/providers/replicate.ts`)
- Mock mode (default for deterministic testing)

## Hugging Face adapter configuration

The Hugging Face adapter reads configuration from environment variables:

- `HF_TOKEN` (required): Hugging Face access token.
- `HF_MODEL` (required unless passed as `input.model`): model ID to target.
- `HF_PROVIDER` (optional): inference provider routing hint (for example,
  `nebius`, `fal-ai`, etc.).

`HuggingFaceProvider` is server-side only and should not be instantiated in
browser code.

## Replicate adapter configuration

The Replicate adapter reads configuration from environment variables:

- `REPLICATE_API_TOKEN` (required): Replicate API token used for server-side authentication.
- `REPLICATE_MODEL` (required unless passed as `input.model`): model version slug to execute via `client.run()`.

`ReplicateProvider` is server-side only and should not be instantiated in
browser code.

## Repository structure

```text
.
├─ .devcontainer/
├─ .github/workflows/
├─ docs/
├─ examples/
│  └─ web/
├─ src/
├─ test/
├─ AGENTS.md
├─ package.json
├─ tsconfig.json
└─ README.md
```

## License

TBD
