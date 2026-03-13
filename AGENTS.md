# AGENTS.md

Guidelines for coding agents working in this repository.

## Scope

These instructions apply to the full repository unless overridden by a deeper `AGENTS.md`.

## Project constraints

- Use Node.js 20 and pnpm.
- Keep tests deterministic and mock-only; do not add external network calls in tests.
- Keep model integrations provider-agnostic in this starter scaffold.
- Never hardcode secrets or API keys in source files or docs.

## Development workflow

1. Install dependencies: `pnpm install`
2. Validate formatting: `pnpm lint`
3. Type-check: `pnpm typecheck`
4. Run tests: `pnpm test`
5. Build: `pnpm build`

## CI expectations

Any PR should keep `.github/workflows/ci.yml` green with the command sequence above.
