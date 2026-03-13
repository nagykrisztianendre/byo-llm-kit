# Buyer Persona: Indie Product Builder

## Persona Summary

An indie SaaS developer building internal or customer-facing tools who wants AI features without committing to a single model provider.

## Goals

- Add AI features to an existing Node.js product quickly.
- Keep the option to switch model providers as pricing and quality change.
- Maintain deterministic tests and stable CI.
- Avoid spending time building starter infrastructure.

## Pain Points

- Starter templates are often coupled to one provider.
- Changing vendors usually means rewriting business logic.
- Early-stage products need low setup overhead.
- Team members need reproducible local environments.

## What Success Looks Like

- AI features are delivered without major architecture rewrites.
- Provider changes require only adapter-level updates.
- CI is predictable with no external network dependency in tests.
- New contributors can start in Codespaces and run checks immediately.
