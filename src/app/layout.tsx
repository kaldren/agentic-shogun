import type { Metadata } from "next";
import { Geist_Mono, Nunito } from "next/font/google";

import "./globals.css";

// Fonts follow DESIGN.md §3.1.
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agentic Shogun",
  description:
    "Learn agentic AI through quizzes, use cases and hands-on exercises.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
