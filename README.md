# BYO-LLM Kit

Build AI features with a provider-agnostic interface, deterministic local development, and no default vendor lock-in.

## Project overview

This template includes:

- A provider abstraction layer for text generation.
- A deterministic mock provider (default, no API keys required).
- Hugging Face and Replicate adapters for real inference.
- A minimal web example that calls providers server-side.
- A Next.js App Router example for production-style integration.
- CI-friendly scripts for lint, typecheck, test, and build.

## 10-minute quickstart

This quickstart works in **GitHub Codespaces** and local development with no provider keys.

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Build the project:
   ```bash
   pnpm build
   ```
3. Start the example app in default mock mode:
   ```bash
   pnpm dev
   ```
4. In a second terminal, verify your installation:
   ```bash
   byo-llm verify
   ```

Expected output includes:

- `✔ Node version OK`
- `✔ Dependencies installed`
- `✔ Mock provider working`
- `✔ Prompt execution successful`
- `BYO-LLM Kit is ready.`

That flow is deterministic and works without any API keys.

## Run the example app

```bash
pnpm dev
```

The example server is in `examples/web/server.mjs` and serves:

- `GET /health` for health checks.
- `POST /api/generate` for text generation requests.

By default:

- `WEB_PROVIDER=mock`
- Responses are deterministic and local.

## Switching providers

Keep `WEB_PROVIDER=mock` for local onboarding and CI. When you are ready, switch providers in Codespaces with environment variables.

### Hugging Face

```bash
WEB_PROVIDER=huggingface HF_TOKEN=your_token HF_MODEL=your_model pnpm dev
```

Optional:

- `HF_PROVIDER` (inference routing hint)

### Replicate

```bash
WEB_PROVIDER=replicate REPLICATE_API_TOKEN=your_token REPLICATE_MODEL=owner/model:version pnpm dev
```

## Required environment variables

### Mock (default)

- No API keys required.

### Hugging Face

- `WEB_PROVIDER=huggingface`
- `HF_TOKEN`
- `HF_MODEL` (unless supplied per request)

### Replicate

- `WEB_PROVIDER=replicate`
- `REPLICATE_API_TOKEN`
- `REPLICATE_MODEL` (unless supplied per request)

## Next.js App Router example

A production-style example is available in [`examples/nextjs`](./examples/nextjs). It demonstrates:

- server-only provider execution through `app/api/generate/route.ts`
- provider selection at request time with the existing router
- a simple `/playground` UI using a client component
- default mock mode so it runs without API keys

Run it locally:

```bash
cd examples/nextjs
pnpm install
pnpm dev
```

Then open `http://localhost:3000/playground`.

### Next.js provider configuration

The route uses `loadConfig()` and overrides `provider` from the request body.

Default (mock mode):

```bash
LLM_PROVIDER=mock
```

Hugging Face:

```bash
LLM_PROVIDER=huggingface HF_TOKEN=your_token HF_MODEL=your_model pnpm dev
```

Replicate:

```bash
LLM_PROVIDER=replicate REPLICATE_API_TOKEN=your_token REPLICATE_MODEL=owner/model:version pnpm dev
```

You can still switch providers from the UI selector (`mock`, `huggingface`, `replicate`) for each generation request.

## Security and privacy guidance

This is a BYO-key template: provider credentials stay in your infrastructure.

- Store provider keys in runtime secret managers (for example GitHub Secrets for CI).
- Keep `HF_TOKEN` and `REPLICATE_API_TOKEN` in secrets, not source files.
- Never commit `.env` files or paste credentials into logs.
- The template includes redaction helpers to sanitize token-like strings in surfaced errors.

Example: local development with an untracked `.env` file:

```bash
HF_TOKEN=...
HF_MODEL=...
REPLICATE_API_TOKEN=...
REPLICATE_MODEL=...
```

For full policy details, see [`SECURITY.md`](./SECURITY.md) and [`PRIVACY.md`](./PRIVACY.md).

## Prompt evaluation CLI

Use the evaluation command to compare the same prompt across providers and prompt versions with structured output (text, latency, and metadata).

```bash
byo-llm eval summarize --provider mock --version v1
```

Compare multiple providers and versions (repeat flags or pass comma-separated values):

```bash
byo-llm eval summarize --provider mock --provider huggingface --version v1 --version v2
```

Run evaluation from a dataset file and export a machine-readable report:

```bash
byo-llm eval summarize --provider mock --input-file eval-datasets/summarize.json --output report.json
```

Dataset format (`eval-datasets/summarize.json`):

```json
[{ "input": "Long article text" }, { "input": "Another example text" }]
```

The default provider is `mock`, so evaluation works without API keys in local development and CI.

## Demo

Use these commands to demonstrate core BYO-LLM kit workflows in deterministic mock mode.

Run a prompt with the CLI:

```bash
byo-llm run summarize "Long article text"
```

Run an evaluation for the same prompt:

```bash
byo-llm eval summarize
```

To generate a reproducible terminal transcript used by demo assets:

```bash
pnpm build
node dist/scripts/generate-demo.js
```

See [`docs/demo-assets.md`](./docs/demo-assets.md) for screenshot and listing asset instructions.
Demo assets in this repository are text-only and reproducible (no binary files are committed).

## Optional provider integration tests (manual)

Default CI stays fully mock-only. Real-provider checks are separated into an **opt-in GitHub Actions workflow** that runs only when manually triggered.

- Workflow file: `.github/workflows/integration.yml`
- Trigger: `workflow_dispatch` only
- Purpose: buyer/maintainer validation with customer-supplied provider keys

### Run from GitHub Actions

1. Open **Actions** in GitHub.
2. Select **Integration Tests**.
3. Click **Run workflow**.

### Repository secrets used by the workflow

Hugging Face:

- `HF_TOKEN` (required to run Hugging Face integration test)
- `HF_MODEL` (optional override)
- `HF_PROVIDER` (optional routing hint)

Replicate:

- `REPLICATE_API_TOKEN` (required to run Replicate integration test)
- `REPLICATE_MODEL` (optional override)

If a provider token is missing, that provider test is skipped cleanly while other configured provider tests continue.

Run integration tests locally (optional):

```bash
pnpm test:integration
```

Normal test command remains mock-only:

```bash
pnpm test
```

## Docs

All documentation for GitHub Pages lives under [`docs/`](docs/):

- Landing page: `docs/index.html`
- Codespaces setup: `docs/getting-started.md`
- Provider setup: `docs/providers.md`
- Testing strategy: `docs/testing.md`
- Troubleshooting: `docs/troubleshooting.md`
- Example applications: `docs/examples.md`

## Golden tests for prompts

Golden tests let you pin prompt behavior to stable, reviewable expectations. In this kit, golden tests run against the deterministic mock provider, so they stay fast and do not make network calls.

- Golden helper utilities live in `src/testing/golden.ts`.
- Prompt fixtures live in `tests/fixtures/prompts/`.
- Golden tests live in `tests/golden/`.

### Add a new golden test

1. Create a fixture JSON file under `tests/fixtures/prompts/` with:
   - prompt name and args
   - generation options (model, maxTokens, temperature)
   - expected metadata and required text snippets
2. Add a `*.golden.test.ts` test under `tests/golden/`.
3. Resolve the prompt from the registry, render it, and call `generateText(...)` (mock mode by default).
4. Use `assertGoldenMatch(...)` for partial structured assertions and `assertTextContains(...)` for stable text snippets.

Run all tests (including golden tests):

```bash
pnpm test
```
