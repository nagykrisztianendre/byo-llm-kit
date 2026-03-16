# Document Q&A

Ask targeted questions against a document body.

## Prompt

Uses prompt registry entry: `document-qa` (`v1`).

## CLI example

```bash
byo-llm run document-qa --file examples/use-cases/document-qa/example-doc.txt --question "What is the warranty period?"
```

## Sample dataset

- `example-doc.txt` contains a realistic policy excerpt.
- `sample-questions.json` includes example questions.
