import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Catalyst Wire — Trading Intelligence Platform",
  description: "Real-time AI-scored catalyst intelligence. SEC filings, insider trades, congressional disclosures, earnings, FDA decisions — ranked and actionable.",
};
export const viewport: Viewport = { themeColor: "#050810" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
