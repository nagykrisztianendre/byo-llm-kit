# BYO-LLM Kit — No Vendor Lock-in

## What this project is

A developer-focused template repository for building AI-powered SaaS features in Node.js + TypeScript with provider flexibility.

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

## Example usage

```ts
import { getStarterKitInfo } from './src/index.js';

const info = getStarterKitInfo();
console.log(info);
```

## Supported providers

- Hugging Face (planned adapter path)
- Replicate (planned adapter path)
- Mock mode (default for deterministic testing)

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
