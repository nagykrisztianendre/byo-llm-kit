import type { PromptDefinition, PromptMeta } from "./types.js";

export interface SummarizePromptArgs {
  text: string;
  audience?: string;
}

export const summarizeV1PromptMeta: PromptMeta<"summarize"> = {
  name: "summarize",
  version: "v1",
  description: "Summarize a long text",
};

export const summarizeV1Prompt: PromptDefinition<
  "summarize",
  SummarizePromptArgs
> = {
  ...summarizeV1PromptMeta,
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

export const summarizeV2PromptMeta: PromptMeta<"summarize"> = {
  name: "summarize",
  version: "v2",
  description: "Summarize a long text with key takeaways and actions",
};

export const summarizeV2Prompt: PromptDefinition<
  "summarize",
  SummarizePromptArgs
> = {
  ...summarizeV2PromptMeta,
  build: ({ text, audience }) => {
    const audienceLine = audience
      ? `Target audience: ${audience}.`
      : "Target audience: general.";

    return [
      "You are a concise assistant.",
      audienceLine,
      "Provide a short summary with 3 bullet points and a final action item.",
      "Text to summarize:",
      text,
    ].join("\n");
  },
};

export const promptMeta = summarizeV2PromptMeta;
export const summarizePrompt = summarizeV2Prompt;
