import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
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
      className={`dark h-full ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="h-full overflow-hidden antialiased selection:bg-[#32235c] selection:text-[#f8c076] text-[#e2dcff] font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
