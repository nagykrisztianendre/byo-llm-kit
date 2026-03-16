# Troubleshooting

Use this guide when `byo-llm verify` or the quickstart flow does not pass on first run.

## Node version issues

Symptoms:

- `Node.js 20+ is required`
- build or typecheck errors caused by unsupported runtime features

Fix:

1. Check your version:
   ```bash
   node -v
   ```
2. Install or switch to Node.js 20+.
3. Re-run:
   ```bash
   pnpm build
   byo-llm verify
   ```

## pnpm issues

Symptoms:

- `pnpm is not available on PATH`
- `pnpm: command not found`

Fix:

1. Check installation:
   ```bash
   pnpm --version
   ```
2. If missing, install pnpm (for example using Corepack):
   ```bash
   corepack enable
   corepack prepare pnpm@9.15.0 --activate
   ```
3. Reinstall dependencies:
   ```bash
   pnpm install
   ```

## Provider key setup

Quickstart and `byo-llm verify` run in `mock` mode and do not require API keys.

If you switch to real providers and get auth/model errors, set the matching variables:

- Hugging Face: `LLM_PROVIDER=huggingface`, `HF_TOKEN`, optional `HF_MODEL`
- Replicate: `LLM_PROVIDER=replicate`, `REPLICATE_API_TOKEN`, optional `REPLICATE_MODEL`

Never commit credentials in source files or docs; use environment variables or secret managers.

## Codespaces tips

- If `byo-llm` command is not found, run `pnpm build` first so `dist/src/cli/index.js` exists.
- Keep one terminal running `pnpm dev`, and use a second terminal for `byo-llm verify`.
- If forwarded ports are not visible, restart the dev server and verify port `3000` forwarding in Codespaces.
- If dependencies look stale after branch switches:
  ```bash
  pnpm install
  pnpm build
  ```
