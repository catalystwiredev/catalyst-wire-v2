import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Catalyst Wire — Trading Intelligence Platform",
  description: "Real-time AI-scored catalyst intelligence. SEC filings, insider trades, congressional disclosures, earnings, FDA decisions — ranked and actionable.",
  keywords: "stock market, catalyst, SEC filings, insider trades, FDA decisions, earnings, trading signals, AI",
  openGraph: {
    title: "Catalyst Wire — Trading Intelligence Platform",
    description: "Real-time AI-scored catalyst intelligence for every investment instrument.",
    type: "website",
  },
};
export const viewport: Viewport = { themeColor: "#050810" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
