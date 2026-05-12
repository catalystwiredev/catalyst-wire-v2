import Link from "next/link";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: `We collect information you provide directly: name, email address, and password (stored as a bcrypt hash — we never store plain-text passwords). If you upgrade, Stripe collects and stores your payment information; we only receive a Stripe customer ID token.\n\nWe automatically collect: IP address, browser type, pages visited, and session duration via Azure Application Insights for performance monitoring and fraud prevention.`,
  },
  {
    title: "2. How We Use Your Information",
    body: `Your information is used solely to: (a) authenticate your account; (b) deliver the services you subscribed to; (c) send transactional emails (account creation, billing receipts); (d) improve platform performance and fix bugs. We do not sell, rent, or share your personal data with third parties for marketing purposes.`,
  },
  {
    title: "3. Data Storage & Security",
    body: `User data is stored in Azure SQL (West US region) with encryption at rest and TLS in transit. Payment data is handled exclusively by Stripe (PCI-DSS Level 1 certified). We implement bcrypt hashing (cost factor 12), JWT authentication with short-lived tokens, and HTTPS enforcement across all endpoints.`,
  },
  {
    title: "4. Cookies & Session Tokens",
    body: `We use a single HTTP-only session cookie set by NextAuth.js to maintain your login state. We do not use advertising cookies, cross-site tracking, or third-party analytics cookies. You may clear this cookie at any time by signing out.`,
  },
  {
    title: "5. Financial Data Disclaimer",
    body: `All market data, catalyst scores, AI verdicts, and signals on Catalyst Wire are for informational and educational purposes only. Nothing on this platform constitutes financial advice, investment advice, or a recommendation to buy or sell any security. Past signal performance does not guarantee future results. Always do your own due diligence and consult a licensed financial advisor before making investment decisions.`,
  },
  {
    title: "6. Third-Party Services",
    body: `We integrate with: Stripe (payments), TradingView (charting widgets), SEC EDGAR (public filings data), Federal Reserve FRED API (economic data), and Azure (infrastructure). Each has its own privacy policy. TradingView widgets may set their own cookies when loaded.`,
  },
  {
    title: "7. Your Rights",
    body: `You may request deletion of your account and all associated personal data at any time by emailing catalystwiredev@gmail.com. We will process deletion requests within 14 business days. You may also request a copy of your stored data.`,
  },
  {
    title: "8. Changes to This Policy",
    body: `We will notify registered users by email of any material changes to this Privacy Policy at least 14 days before they take effect. Continued use of the platform after that date constitutes acceptance.`,
  },
  {
    title: "9. Contact",
    body: `Privacy questions: catalystwiredev@gmail.com. For general support, visit our Contact page.`,
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 10 }}>Legal</div>
        <h1 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 10 }}>Privacy Policy</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Last updated: May 12, 2026</p>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, marginTop: 14 }}>
          This Privacy Policy explains how Catalyst Wire ("we," "us," "our") collects, uses, and protects your personal information when you use our platform.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {SECTIONS.map(({ title, body }) => (
          <section key={title}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: "var(--text-primary)" }}>{title}</h2>
            {body.split("\n\n").map((para, i) => (
              <p key={i} style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 10 }}>{para}</p>
            ))}
          </section>
        ))}
      </div>

      <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border)", display: "flex", gap: 24, flexWrap: "wrap" }}>
        <Link href="/terms" style={{ fontSize: 13, color: "var(--accent)", textDecoration: "none" }}>Terms of Service</Link>
        <Link href="/contact" style={{ fontSize: 13, color: "var(--accent)", textDecoration: "none" }}>Contact Us</Link>
      </div>
    </div>
  );
}
