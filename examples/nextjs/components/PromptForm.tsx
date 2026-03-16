"use client";

import { FormEvent, useState } from "react";

const providers = ["mock", "huggingface", "replicate"] as const;

type Provider = (typeof providers)[number];

interface GenerateResponse {
  text: string;
  metadata: {
    provider: Provider;
    model: string;
  };
}

export function PromptForm() {
  const [prompt, setPrompt] = useState(
    "Write a one-sentence summary of why provider-agnostic AI is useful.",
  );
  const [provider, setProvider] = useState<Provider>("mock");
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt, provider }),
      });

      const payload = (await response.json()) as
        | GenerateResponse
        | { error: string };

      if (!response.ok) {
        setError("error" in payload ? payload.error : "Generation failed");
        return;
      }

      setResult(payload as GenerateResponse);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : String(requestError),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: "0.75rem" }}>
      <label>
        Prompt
        <textarea
          required
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          style={{ width: "100%", minHeight: 140, marginTop: "0.5rem" }}
        />
      </label>

      <label>
        Provider
        <select
          value={provider}
          onChange={(event) => setProvider(event.target.value as Provider)}
          style={{ width: "100%", marginTop: "0.5rem" }}
        >
          {providers.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <button disabled={isLoading} type="submit" style={{ width: 180 }}>
        {isLoading ? "Generating..." : "Generate"}
      </button>

      <pre
        style={{
          background: "#f5f5f5",
          padding: "1rem",
          whiteSpace: "pre-wrap",
        }}
      >
        {error && `Error: ${error}`}
        {!error &&
          result &&
          `Provider: ${result.metadata.provider}\nModel: ${result.metadata.model}\n\n${result.text}`}
        {!error && !result && "No output yet."}
      </pre>
    </form>
  );
}
