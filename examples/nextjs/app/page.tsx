import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ maxWidth: 720, margin: "3rem auto", padding: "0 1rem" }}>
      <h1>BYO-LLM Kit + Next.js</h1>
      <p>
        This example demonstrates server-side provider execution with Next.js
        App Router. It defaults to deterministic mock mode, so it works without
        API keys.
      </p>
      <Link href="/playground">Open prompt playground</Link>
    </main>
  );
}
