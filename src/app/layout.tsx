import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { VercelToolbar } from "@vercel/toolbar/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { UmamiAnalytics } from "@/lib/umami";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "RIOU Kevin - Portfolio",
  description: "RIOU Kevin - Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const shouldInjectToolbar = false; // process.env.NODE_ENV === "development";

  return (
    <html lang="en">
      <SpeedInsights />
      <Analytics />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UmamiAnalytics>{children}</UmamiAnalytics>
        {shouldInjectToolbar && <VercelToolbar />}
      </body>
    </html>
  );
}
