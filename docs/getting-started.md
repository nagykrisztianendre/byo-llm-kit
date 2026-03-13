# Getting started in GitHub Codespaces

This guide is optimized for a 10-minute first run.

## 1) Open in Codespaces

- Click **Code** → **Codespaces** → **Create codespace on main**.
- Wait for the environment to finish setup.

## 2) Install dependencies

```bash
pnpm install
```

## 3) Start the example app (mock mode)

```bash
pnpm dev
```

The default provider is `mock`, so no API keys are required.

## 4) Open the app

- In Codespaces, open the forwarded port `3000`.
- Submit a prompt in the web UI.
- You should get deterministic output from the mock provider.

## 5) Validate the project checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Next steps

- Keep using mock mode for local feature development.
- Switch to Hugging Face or Replicate only when you need live inference.
- See [providers.md](./providers.md) for environment variable setup.
