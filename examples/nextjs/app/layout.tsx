import type { ReactNode } from "react";

export const metadata = {
  title: "BYO-LLM Next.js Example",
  description: "A minimal App Router example for BYO-LLM kit",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Arial, sans-serif", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
