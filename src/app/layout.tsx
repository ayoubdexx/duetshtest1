import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Deutschwerk — Learn German from A1 to B2",
    template: "%s · Deutschwerk",
  },
  description:
    "The complete German learning platform: structured CEFR courses from A1 to B2, grammar, vocabulary, flashcards with spaced repetition, reading, listening, speaking, writing, and full Goethe & TELC exam preparation.",
  applicationName: "Deutschwerk",
  keywords: ["learn German", "Deutsch lernen", "A1", "A2", "B1", "B2", "Goethe", "TELC", "German grammar", "German vocabulary"],
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Deutschwerk — Learn German from A1 to B2",
    description: "Structured CEFR courses, spaced-repetition flashcards and full Goethe & TELC exam preparation.",
    type: "website",
    locale: "en_US",
    siteName: "Deutschwerk",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e11" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${mono.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
        <PwaRegister />
      </body>
    </html>
  );
}
