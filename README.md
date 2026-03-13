# BYO-LLM Kit

A minimal Node.js + TypeScript starter repository for building AI-powered SaaS features with a **Bring Your Own LLM** architecture.

This scaffold is intentionally provider-agnostic while reserving adapter slots for:

- Hugging Face
- Replicate

> Initial version includes only base structure, devcontainer setup, CI, and test tooling.

## Quick start

### Local prerequisites

- Node.js 20+
- pnpm 9+

### Install and run checks

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## GitHub Codespaces

1. Open the repository in a Codespace.
2. Wait for the devcontainer to finish setup.
3. Run:

```bash
pnpm i
pnpm test
```

The devcontainer uses Node.js 20 and enables pnpm through Corepack.

## Repository structure

```text
.
├─ .devcontainer/
│  └─ devcontainer.json
├─ .github/
│  └─ workflows/
│     └─ ci.yml
├─ src/
│  └─ index.ts
├─ test/
│  └─ smoke.test.ts
├─ AGENTS.md
├─ package.json
├─ tsconfig.json
└─ README.md
```

## CI workflow

GitHub Actions runs on both `push` and `pull_request`, executing the following in order:

1. `pnpm lint`
2. `pnpm typecheck`
3. `pnpm test`
4. `pnpm build`

Dependency caching is enabled via `actions/setup-node` + pnpm cache for fast execution.

## Deterministic tests

Tests are run using Vitest and are designed for deterministic, mock-only behavior with no network calls.

## Security notes

- No SDK or environment variable reference is included for any vendor-specific key.
- Keep secrets in GitHub Codespaces or Actions secrets, never in source control.
