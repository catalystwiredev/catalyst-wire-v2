import Link from "next/link";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: `By creating an account or using Catalyst Wire (the "Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.`,
  },
  {
    title: "2. Description of Service",
    body: `Catalyst Wire provides AI-scored financial catalyst intelligence including SEC filing summaries, insider trade disclosures, congressional STOCK Act disclosures, FDA decision previews, earnings previews, and related market data. The Service is for informational purposes only and does not constitute financial advice.`,
  },
  {
    title: "3. Not Financial Advice",
    body: `ALL CONTENT ON CATALYST WIRE IS FOR INFORMATIONAL AND EDUCATIONAL PURPOSES ONLY. Nothing on this platform constitutes investment advice, a recommendation to buy or sell any security, or financial planning guidance. AI scores, verdicts, and signals are algorithmic outputs and may be incorrect. You should not make investment decisions based solely on information from this Service. Consult a registered financial advisor before making investment decisions. Past signal accuracy does not guarantee future performance.`,
  },
  {
    title: "4. Subscription & Billing",
    body: `Free-tier access is available without a payment method. Paid plans (Alpha, Institutional) are billed monthly or annually via Stripe. Subscriptions auto-renew unless cancelled. You may cancel at any time through your Account page. Refunds are not provided for partial billing periods, except where required by applicable law. Prices may change with 30 days' notice.`,
  },
  {
    title: "5. Acceptable Use",
    body: `You agree not to: (a) redistribute, resell, or sub-license platform data to third parties; (b) scrape, crawl, or harvest platform data programmatically (except via our official API for Institutional subscribers); (c) reverse engineer the platform; (d) use the Service for any illegal purpose; (e) upload content that is defamatory, abusive, or violates any law. Violation may result in immediate account termination without refund.`,
  },
  {
    title: "6. Intellectual Property",
    body: `All platform software, design, scoring algorithms, and compiled data presentations are the property of Catalyst Wire. Underlying data sourced from public domain sources (SEC EDGAR, FRED, congressional disclosures) remains in the public domain. AI-generated analysis and scoring outputs are proprietary.`,
  },
  {
    title: "7. Disclaimer of Warranties",
    body: `THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR THAT DATA WILL BE ACCURATE, COMPLETE, OR TIMELY. FINANCIAL MARKET DATA CAN BE DELAYED, INCORRECT, OR INCOMPLETE.`,
  },
  {
    title: "8. Limitation of Liability",
    body: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, CATALYST WIRE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, INCLUDING BUT NOT LIMITED TO INVESTMENT LOSSES, LOST PROFITS, OR DATA LOSS, ARISING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID IN THE 12 MONTHS PRECEDING THE CLAIM.`,
  },
  {
    title: "9. Termination",
    body: `We reserve the right to suspend or terminate your account for violations of these Terms, non-payment, or for any reason with 7 days' notice. You may terminate your account at any time via Account Settings or by contacting us.`,
  },
  {
    title: "10. Governing Law",
    body: `These Terms are governed by the laws of the State of Texas, United States. Any disputes shall be resolved in the courts of Ector County, Texas.`,
  },
  {
    title: "11. Changes to Terms",
    body: `We may update these Terms. Material changes will be communicated by email at least 14 days in advance. Continued use after the effective date constitutes acceptance.`,
  },
  {
    title: "12. Contact",
    body: `Questions about these Terms: catalystwiredev@gmail.com`,
  },
];

export default function TermsPage() {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 10 }}>Legal</div>
        <h1 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 10 }}>Terms of Service</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Last updated: May 5, 2026</p>
      </div>

      <div style={{ background: "var(--bear-dim)", border: "1px solid var(--bear-border)", borderRadius: 10, padding: "14px 18px", marginBottom: 36 }}>
        <p style={{ fontSize: 13, color: "var(--bear)", fontWeight: 600, lineHeight: 1.6 }}>
          IMPORTANT DISCLAIMER: Catalyst Wire is not a registered investment advisor. All signals, scores, and analysis are for educational purposes only. Never invest money you cannot afford to lose.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {SECTIONS.map(({ title, body }) => (
          <section key={title}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{title}</h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>{body}</p>
          </section>
        ))}
      </div>

      <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border)", display: "flex", gap: 24, flexWrap: "wrap" }}>
        <Link href="/privacy" style={{ fontSize: 13, color: "var(--accent)", textDecoration: "none" }}>Privacy Policy</Link>
        <Link href="/contact" style={{ fontSize: 13, color: "var(--accent)", textDecoration: "none" }}>Contact Us</Link>
      </div>
    </div>
  );
}
