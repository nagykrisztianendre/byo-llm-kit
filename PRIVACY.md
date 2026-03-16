# Privacy Policy

## Execution model

This BYO-LLM template is intended to run:

- locally on developer machines, or
- in infrastructure controlled by the adopting team.

The template code itself does not include built-in user tracking or centralized data collection.

## Data collection statement

- The starter template does not operate a hosted backend.
- The repository does not transmit user prompts or provider keys to a template-owned service.
- Any prompt or output data handling occurs in your runtime and with your chosen model provider.

## Optional analytics

If you add analytics/telemetry to your own deployment:

- keep it **opt-in** where possible,
- disclose collection clearly to users,
- avoid sending raw prompts unless business/legal requirements are satisfied,
- scrub or hash sensitive content before export.

## Team best practices for prompt and output handling

1. Treat prompts and model outputs as potentially sensitive business/user data.
2. Apply least-privilege access controls to logs, traces, and datasets.
3. Define retention limits for prompt/output records.
4. Redact secrets and personal data before storing diagnostics.
5. Review provider data usage terms for each model vendor you enable.

## Shared responsibility

Using this starter kit means your team is responsible for:

- infrastructure security,
- secret management,
- legal/privacy compliance,
- and user disclosure obligations.
