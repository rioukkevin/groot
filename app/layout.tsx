import localFont from "next/font/local";

import type { Metadata, Viewport } from "next";

import "./globals.css";

/**
 * Self-hosted rather than pulled from Google Fonts: the `latin` subset there
 * omits box drawing (U+2500–257F) and block elements (U+2580–259F), so every
 * frame, meter bar and separator in the transcript fell back to a font with a
 * different advance width and broke the monospace grid.
 */
const jetbrainsMono = localFont({
  variable: "--font-jetbrains-mono",
  display: "swap",
  src: [
    { path: "./fonts/JetBrainsMono-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/JetBrainsMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/JetBrainsMono-Italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/JetBrainsMono-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/JetBrainsMono-Bold.woff2", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "kr — portfolio shell",
  description:
    "Kevin Riou · fullstack web developer, freelance. A portfolio you drive like a terminal.",
};

export const viewport: Viewport = {
  themeColor: "#0c0c0c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
