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
│  ├─ buyer-persona.md
│  ├─ landing-copy.md
│  └─ product-spec.md
├─ src/
├─ test/
├─ AGENTS.md
├─ package.json
├─ tsconfig.json
└─ README.md
```

## License

TBD
