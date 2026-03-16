import type { PromptDefinition, PromptMeta } from "./types.js";

export interface DocumentQaPromptArgs {
  documentText: string;
  question: string;
}

export const documentQaV1PromptMeta: PromptMeta<"document-qa"> = {
  name: "document-qa",
  version: "v1",
  description: "Answer a question using only the provided document",
};

export const documentQaV1Prompt: PromptDefinition<
  "document-qa",
  DocumentQaPromptArgs
> = {
  ...documentQaV1PromptMeta,
  build: ({ documentText, question }) => {
    return [
      "You answer questions by extracting facts from the provided document only.",
      "If the answer is not in the document, reply: 'Not found in document.'",
      "Document:",
      documentText,
      "Question:",
      question,
      "Answer:",
    ].join("\n");
  },
};
