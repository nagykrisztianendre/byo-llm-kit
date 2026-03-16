# Security Policy

## BYO key handling model

This template is designed for **Bring Your Own (BYO) provider keys**.

- API keys are read from your runtime environment (for example `HF_TOKEN` and `REPLICATE_API_TOKEN`).
- Keys are used only to authenticate requests from your infrastructure to the selected model provider.
- The template does **not** persist keys in source control, databases, or telemetry by default.
- The project does not include OpenAI SDK integrations in this scaffold.

## Secure secret storage recommendations

Use your platform's secret manager and inject values as environment variables at runtime.

Recommended patterns:

- **GitHub Actions**: repository/environment secrets.
- **Cloud runtime**: provider-specific secret stores (for example Vercel/Netlify/Render/Fly.io/AWS/GCP secret managers).
- **Local development**: untracked `.env` files only; never commit them.

Minimum guidance:

1. Store `HF_TOKEN` and `REPLICATE_API_TOKEN` in a secret manager.
2. Scope tokens with the least privilege and rotate regularly.
3. Avoid sharing tokens in issue threads, PR comments, logs, or screenshots.

## Logging policy

- Never log raw API keys, tokens, authorization headers, or full provider config objects containing secrets.
- Error handling should sanitize sensitive values before printing or returning messages.
- This repository includes `src/security/redactSecrets.ts` to redact token-like values if messages are surfaced.

## Vulnerability reporting

If you discover a security issue, please report it privately to the maintainers instead of opening a public issue.

Include:

- impact summary
- affected files/flows
- reproduction steps
- suggested remediation (if known)

Maintainers should acknowledge reports promptly and coordinate a fix/release window before public disclosure.

## What this template does not do

- It does not collect, escrow, or centrally transmit your provider keys.
- It does not provide hosted key management.
- It does not guarantee downstream app-level compliance; implement your own org policies for access control, audit logging, and incident response.
