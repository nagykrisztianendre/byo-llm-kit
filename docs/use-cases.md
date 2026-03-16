# Production AI Use-Case Pack

This pack demonstrates practical features teams can ship immediately using the BYO-LLM kit in deterministic mock mode.

## Available AI features

1. **Article Summarizer** (`summarize`)
   - Turns long-form text into concise takeaways and an action item.
2. **Email Generator** (`email-generator`)
   - Drafts professional emails with configurable tone, audience, and purpose.
3. **Product Description Generator** (`product-description`)
   - Produces marketing-oriented descriptions from compact product details.
4. **Document Q&A** (`document-qa`)
   - Answers questions using only facts present in a provided document.

## How to run each example

All commands below run with the default `mock` provider and require no API keys.

### 1) Article Summarizer

```bash
byo-llm run summarize "Long article text"
```

Files:

- `examples/use-cases/article-summarizer/README.md`
- `examples/use-cases/article-summarizer/sample-articles.json`

### 2) Email Generator

```bash
byo-llm run email-generator "Write a follow-up email after a job interview" --tone warm --audience "hiring manager" --purpose "thank them and restate fit"
```

Files:

- `examples/use-cases/email-generator/README.md`
- `examples/use-cases/email-generator/sample-requests.json`

### 3) Product Description Generator

```bash
byo-llm run product-description "Wireless headphones with 30h battery"
```

Files:

- `examples/use-cases/product-description/README.md`
- `examples/use-cases/product-description/sample-products.json`

### 4) Document Q&A

```bash
byo-llm run document-qa --file examples/use-cases/document-qa/example-doc.txt --question "What is the warranty period?"
```

Files:

- `examples/use-cases/document-qa/README.md`
- `examples/use-cases/document-qa/example-doc.txt`
- `examples/use-cases/document-qa/sample-questions.json`

## Build your own feature with the kit

1. Add a prompt definition in `src/prompts/` with metadata (`name`, `version`, `description`) and a deterministic `build` function.
2. Register it in `src/prompts/registry.ts`.
3. Add CLI argument mapping in `src/cli/runPrompt.ts`.
4. Add a use-case folder under `examples/use-cases/<your-feature>/` with:
   - `README.md`
   - `prompt.json`
   - sample dataset
5. Add tests for prompt registry loading and CLI execution in mock mode.
