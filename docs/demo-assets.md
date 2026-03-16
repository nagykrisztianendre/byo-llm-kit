# Demo asset generation guide

This guide shows how to regenerate launch demo materials in deterministic mock mode using text-only artifacts (no committed binaries).

## Prerequisites

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Build once so the CLI binary is available:

   ```bash
   pnpm build
   ```

3. Keep providers in mock mode:

   ```bash
   export LLM_PROVIDER=mock
   export WEB_PROVIDER=mock
   ```

## 1) Generate terminal demo output

Run the scripted demo command sequence:

```bash
node dist/scripts/generate-demo.js
```

This runs:

- `byo-llm run summarize "Long article text"`
- `byo-llm eval summarize --provider mock --version v1`

The formatted transcript is saved to `demo-output.txt`.

## 2) Capture screenshots locally (optional, not committed)

If you need screenshots for external listings, capture them locally and store/distribute them outside this repository:

- CLI run screenshot (`byo-llm run summarize "Long article text"`)
- CLI evaluation screenshot (`byo-llm eval summarize --provider mock --version v1`)
- Playground screenshot (`http://localhost:3000/playground` in mock mode)

Do not commit PNG or ZIP assets to this repository.

## 3) Repository asset policy

Committed demo artifacts should remain text-only:

- `demo-output.txt`
- documentation files in `docs/`

No binary assets (`.png`, `.gif`, `.zip`) should be committed.
