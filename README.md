# BYO-LLM Kit

Build AI features with a provider-agnostic interface, deterministic local development, and no default vendor lock-in.

## Project overview

This template includes:

- A provider abstraction layer for text generation.
- A deterministic mock provider (default, no API keys required).
- Hugging Face and Replicate adapters for real inference.
- A minimal web example that calls providers server-side.
- CI-friendly scripts for lint, typecheck, test, and build.

## 10-minute quickstart (GitHub Codespaces)

1. Open this repository in **GitHub Codespaces**.
2. In the terminal, install dependencies:
   ```bash
   pnpm install
   ```
3. Start the example app in default mock mode:
   ```bash
   pnpm dev
   ```
4. Open the forwarded port (`3000`) and submit a prompt in the UI.

That flow works without any API keys.

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

## Docs

All documentation for GitHub Pages lives under [`docs/`](docs/):

- Landing page: `docs/index.html`
- Codespaces setup: `docs/getting-started.md`
- Provider setup: `docs/providers.md`

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
