import {
  playgroundClientScript,
  renderPlayground,
} from "../components/Playground.js";

export function renderPlaygroundPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BYO-LLM Kit Prompt Playground</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 2rem;
        max-width: 760px;
      }
      .field-row {
        margin-bottom: 1rem;
      }
      label {
        display: block;
        font-weight: 600;
        margin-bottom: 0.35rem;
      }
      textarea,
      select,
      button {
        width: 100%;
        font: inherit;
      }
      textarea {
        min-height: 180px;
        resize: vertical;
      }
      button {
        margin-top: 0.5rem;
        padding: 0.6rem;
      }
      pre {
        background: #f4f4f5;
        border: 1px solid #e4e4e7;
        border-radius: 6px;
        padding: 1rem;
        white-space: pre-wrap;
      }
    </style>
  </head>
  <body>
    ${renderPlayground()}
    <script>${playgroundClientScript}</script>
  </body>
</html>`;
}
