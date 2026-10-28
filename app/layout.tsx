import type { Metadata } from "next";
import { DM_Sans, Inter, Outfit, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

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
      className={`dark min-h-full ${dmSans.variable} ${inter.variable} ${outfit.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-[100dvh] antialiased selection:bg-teal-500/20 selection:text-teal-400 font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
