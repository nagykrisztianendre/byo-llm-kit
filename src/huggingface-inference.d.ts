declare module "@huggingface/inference" {
  export class InferenceClient {
    constructor(token: string);
    textGeneration(request: {
      model: string;
      inputs: string;
      parameters: {
        max_new_tokens: number;
        temperature: number;
        return_full_text: boolean;
      };
      provider?: string;
    }): Promise<string | { generated_text?: string }>;
  }
}
