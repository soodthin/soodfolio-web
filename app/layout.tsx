import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://soodfolio.com"),
  title: "SoodFolio | The Presentation Portfolio Platform for Developers",
  description: "Create and showcase your developer portfolio as an interactive presentation slide deck.",
  keywords: ["developer portfolio", "slide deck", "presentation", "software engineer", "minimalist", "brutalist"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="dark min-h-full"
    >
      <body className="min-h-[100dvh] antialiased selection:bg-teal-500/20 selection:text-teal-400 font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
