import type { PromptDefinition, PromptMeta } from "./types.js";

export interface ProductDescriptionPromptArgs {
  productInput: string;
}

export const productDescriptionV1PromptMeta: PromptMeta<"product-description"> =
  {
    name: "product-description",
    version: "v1",
    description:
      "Generate a concise marketing-ready product description from product details",
  };

export const productDescriptionV1Prompt: PromptDefinition<
  "product-description",
  ProductDescriptionPromptArgs
> = {
  ...productDescriptionV1PromptMeta,
  build: ({ productInput }) => {
    return [
      "You are a product marketing assistant.",
      "Write a compelling product description in 2 short paragraphs.",
      "Include: key benefits, ideal user, and one call to action.",
      "Product details:",
      productInput,
    ].join("\n");
  },
};
