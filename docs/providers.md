# Provider configuration

BYO-LLM Kit starts in mock mode and can switch providers through environment variables.

## Default: mock mode

Use this for onboarding, local development, and CI.

```bash
WEB_PROVIDER=mock pnpm dev
```

No API keys required.

## Hugging Face

### Required variables

- `WEB_PROVIDER=huggingface`
- `HF_TOKEN`
- `HF_MODEL` (unless supplied dynamically per request)

### Optional

- `HF_PROVIDER` (routing hint for supported inference backends)

### Example

```bash
WEB_PROVIDER=huggingface \
HF_TOKEN=your_token \
HF_MODEL=your_model \
pnpm dev
```

## Replicate

### Required variables

- `WEB_PROVIDER=replicate`
- `REPLICATE_API_TOKEN`
- `REPLICATE_MODEL` (unless supplied dynamically per request)

### Example

```bash
WEB_PROVIDER=replicate \
REPLICATE_API_TOKEN=your_token \
REPLICATE_MODEL=owner/model:version \
pnpm dev
```

## Notes

- Keep provider calls server-side.
- Do not commit secrets; use Codespaces secrets or local environment variables.
- For first-time setup, always confirm behavior in mock mode before enabling external providers.
