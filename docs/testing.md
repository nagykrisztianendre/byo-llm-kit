# Testing strategy

BYO-LLM Kit uses two test layers:

1. **Default tests (mock-only):** fast, deterministic checks run in local dev and CI.
2. **Optional provider integration tests (manual):** real API validation for maintainers/buyers using their own secrets.

## Default CI behavior

The default CI workflow (`.github/workflows/ci.yml`) remains mock-only and runs:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

`pnpm test` excludes `tests/integration/**` so no external network calls are required in normal CI.

## Manual integration workflow

A separate workflow (`.github/workflows/integration.yml`) is available and is intentionally opt-in:

- Trigger: `workflow_dispatch` only
- Runner: `ubuntu-latest`
- Command: `pnpm test:integration`

This workflow is intended for buyer/maintainer validation before production adoption.

## Required/optional secrets

### Hugging Face integration test

- Required to run Hugging Face test: `HF_TOKEN`
- Optional: `HF_MODEL`, `HF_PROVIDER`

### Replicate integration test

- Required to run Replicate test: `REPLICATE_API_TOKEN`
- Optional: `REPLICATE_MODEL`

If a token is missing for a provider, that provider's integration test is skipped cleanly.

## Safety and logging

- Secrets are passed via GitHub Actions secrets and masked in workflow output.
- Integration tests do not print secrets, prompts, or generated text.
- Assertions validate output structure only (`text` and metadata shape), avoiding brittle exact-text checks.
