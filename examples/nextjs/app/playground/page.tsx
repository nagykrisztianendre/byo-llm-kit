import { PromptForm } from "../../components/PromptForm";

export default function PlaygroundPage() {
  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Prompt Playground</h1>
      <p>
        Requests are posted to <code>/api/generate</code>, where provider
        routing and text generation run server-side.
      </p>
      <PromptForm />
    </main>
  );
}
