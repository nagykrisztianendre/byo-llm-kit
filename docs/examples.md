# Example applications

This repository includes runnable examples that demonstrate how to integrate the kit in real applications.

## `examples/web` (Node server)

- Lightweight server-rendered playground
- `POST /api/generate` endpoint
- Good for quick smoke checks

Run:

```bash
pnpm dev
```

## `examples/nextjs` (Next.js App Router)

- Modern Next.js App Router structure
- Server route at `app/api/generate/route.ts`
- Prompt UI at `/playground`
- Provider execution stays server-side
- Works in default mock mode without provider keys

Run:

```bash
cd examples/nextjs
pnpm install
pnpm dev
```

Open `http://localhost:3000/playground`.

### Switching providers

The example reads core environment variables through `loadConfig()` from the kit:

- `LLM_PROVIDER` (`mock`, `huggingface`, `replicate`)
- `HF_TOKEN`, `HF_MODEL`
- `REPLICATE_API_TOKEN`, `REPLICATE_MODEL`

You can also choose the provider per request in the playground form.

### Why this example exists

Many teams deploy Next.js for production web apps. This example shows a practical integration pattern where:

1. The browser sends only prompt input and selected provider.
2. The Next.js server route calls `generateText()`.
3. Provider keys remain on the server only.
