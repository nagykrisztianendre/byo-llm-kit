# BYO-LLM AI Feature Starter Kit

Ship production-ready AI features with **your own model providers**—without vendor lock-in.

This starter kit gives you a complete, provider-agnostic foundation for building, testing, and shipping AI product features fast. Start in deterministic mock mode, then switch to real providers when you are ready.

## Feature overview

- **Provider abstraction + router** for portable model integrations
- **Prompt registry + versioning** for maintainable prompt evolution
- **Golden tests** for deterministic, regression-safe prompt behavior
- **Evaluation tooling** to compare prompt/provider/version outcomes
- **CLI** for running prompts, evals, and verification from the terminal
- **Prompt playground** for rapid iteration
- **Next.js production example** for real app integration patterns
- **Production use-case pack** with practical AI feature templates

## Example AI features included

- **Article Summarizer**
- **Email Generator**
- **Product Description Generator**
- **Document Q&A**

These are ready to run, adapt, and embed into your own product workflows.

## Quickstart

```bash
pnpm install
pnpm build
pnpm dev
byo-llm verify
```

This default flow runs in deterministic mock mode and does not require provider credentials.

## CLI examples

Run a use case:

```bash
byo-llm run summarize
```

Run evaluations:

```bash
byo-llm eval summarize
```

## Project structure

- `src/` — core library code (provider router, adapters, prompt tools, CLI internals)
- `examples/` — runnable examples, including web and Next.js apps plus use-case implementations
- `prompts/` — prompt definitions, templates, and versioned prompt assets
- `docs/` — detailed guides, operational docs, and supporting references

## Supported providers

- **Hugging Face**
- **Replicate**

The architecture is designed so you can add additional providers behind the same abstraction layer.

## Security and privacy

You bring your own provider credentials.

- Keys remain in your environment and infrastructure.
- The starter kit does not require storing your customer data.
- You control provider selection, runtime configuration, and deployment boundaries.

For full details, see [`SECURITY.md`](./SECURITY.md) and [`PRIVACY.md`](./PRIVACY.md).

## Links

- **Documentation:** [`docs/`](./docs/)
- **Examples:** [`examples/`](./examples/)
- **License:** [`LICENSE`](./LICENSE)
