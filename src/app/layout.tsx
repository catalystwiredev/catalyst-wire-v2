import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Catalyst Wire — Trading Intelligence Platform",
  description: "Real-time catalyst intelligence for stocks, options, crypto, and more. SEC filings, insider trades, earnings, FDA decisions — parsed and scored instantly.",
  keywords: "stock market, catalyst, SEC filings, insider trades, FDA decisions, earnings, trading signals",
  openGraph: {
    title: "Catalyst Wire — Trading Intelligence Platform",
    description: "Real-time catalyst intelligence for stocks, options, crypto, and more.",
    type: "website",
  },
};

export const viewport: Viewport = { 
  themeColor: "#050810" 
};

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
