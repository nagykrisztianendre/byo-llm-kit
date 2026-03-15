import type { PromptDefinition } from "./types.js";

export interface SummarizePromptArgs {
  text: string;
  audience?: string;
}

export const summarizePrompt: PromptDefinition<
  "summarize",
  SummarizePromptArgs
> = {
  name: "summarize",
  version: "1.0.0",
  build: ({ text, audience }) => {
    const audienceLine = audience
      ? `Target audience: ${audience}.`
      : "Target audience: general.";

    return [
      "You are a concise assistant.",
      audienceLine,
      "Provide a short summary using 3 bullet points.",
      "Text to summarize:",
      text,
    ].join("\n");
  },
};
