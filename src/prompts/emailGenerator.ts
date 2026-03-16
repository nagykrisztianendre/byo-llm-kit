import type { PromptDefinition, PromptMeta } from "./types.js";

export interface EmailGeneratorPromptArgs {
  request: string;
  tone?: string;
  audience?: string;
  purpose?: string;
}

export const emailGeneratorV1PromptMeta: PromptMeta<"email-generator"> = {
  name: "email-generator",
  version: "v1",
  description: "Generate a practical email draft with subject and body",
};

export const emailGeneratorV1Prompt: PromptDefinition<
  "email-generator",
  EmailGeneratorPromptArgs
> = {
  ...emailGeneratorV1PromptMeta,
  build: ({ request, tone, audience, purpose }) => {
    return [
      "You are an assistant that writes professional email drafts.",
      `Tone: ${tone ?? "professional"}.`,
      `Audience: ${audience ?? "general business contact"}.`,
      `Purpose: ${purpose ?? "follow up with clear next steps"}.`,
      "Return output as:",
      "Subject: <subject line>",
      "Body:",
      "<email body>",
      "Request:",
      request,
    ].join("\n");
  },
};
