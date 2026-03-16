import { renderPrompt } from "../../../src/prompts/registry.js";
import type { ProviderName } from "../../../src/providers/types.js";

const providerOptions: ProviderName[] = ["mock", "huggingface", "replicate"];
const promptTemplates = {
  summarize: renderPrompt("summarize", {
    text: "Paste source text here and click Generate to test the prompt.",
    audience: "general",
  }),
} as const;

type PromptTemplateName = keyof typeof promptTemplates;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderPlayground(): string {
  const providerOptionMarkup = providerOptions
    .map((provider) => `<option value="${provider}">${provider}</option>`)
    .join("");

  const promptOptionMarkup = (
    Object.keys(promptTemplates) as PromptTemplateName[]
  )
    .map((name) => `<option value="${name}">${name}</option>`)
    .join("");

  const serializedTemplates = escapeHtml(JSON.stringify(promptTemplates));

  return `
    <h1>Prompt Playground</h1>
    <p>Experiment with prompts and provider routing. Provider calls are executed server-side only.</p>

    <form id="playground-form">
      <div class="field-row">
        <label for="provider">Provider</label>
        <select id="provider" name="provider">${providerOptionMarkup}</select>
      </div>

      <div class="field-row">
        <label for="promptTemplate">Prompt</label>
        <select id="promptTemplate" name="promptTemplate">${promptOptionMarkup}</select>
      </div>

      <div class="field-row">
        <label for="prompt">Prompt Input</label>
        <textarea id="prompt" name="prompt" required></textarea>
      </div>

      <button type="submit">Generate</button>
    </form>

    <h2>Result</h2>
    <pre id="result" aria-live="polite">No output yet.</pre>

    <h2>Error</h2>
    <pre id="error" aria-live="assertive">No errors.</pre>

    <script id="prompt-templates" type="application/json">${serializedTemplates}</script>
  `;
}

export const playgroundClientScript = `
(() => {
  const form = document.getElementById("playground-form");
  const providerInput = document.getElementById("provider");
  const promptTemplateInput = document.getElementById("promptTemplate");
  const promptInput = document.getElementById("prompt");
  const resultOutput = document.getElementById("result");
  const errorOutput = document.getElementById("error");
  const templateScript = document.getElementById("prompt-templates");

  if (!form || !providerInput || !promptTemplateInput || !promptInput || !resultOutput || !errorOutput || !templateScript) {
    return;
  }

  const templates = JSON.parse(templateScript.textContent || "{}");

  function syncPromptFromTemplate() {
    const selectedTemplate = promptTemplateInput.value;
    if (templates[selectedTemplate] && !promptInput.value.trim()) {
      promptInput.value = templates[selectedTemplate];
    }
  }

  promptTemplateInput.addEventListener("change", () => {
    const selectedTemplate = promptTemplateInput.value;
    if (templates[selectedTemplate]) {
      promptInput.value = templates[selectedTemplate];
    }
  });

  syncPromptFromTemplate();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    resultOutput.textContent = "Generating...";
    errorOutput.textContent = "No errors.";

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          provider: providerInput.value,
          prompt: promptInput.value,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        resultOutput.textContent = "No output yet.";
        errorOutput.textContent = payload.error || "Request failed.";
        return;
      }

      const modelLine = payload.model ? "\\nModel: " + payload.model : "";
      resultOutput.textContent = "Provider: " + payload.provider + modelLine + "\\n\\n" + payload.text;
      errorOutput.textContent = "No errors.";
    } catch (error) {
      resultOutput.textContent = "No output yet.";
      errorOutput.textContent = error instanceof Error ? error.message : String(error);
    }
  });
})();
`;
