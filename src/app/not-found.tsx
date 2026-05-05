import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: 32, textAlign: "center" }}>
      <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--accent)", lineHeight: 1 }}>404</div>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Page not found</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, maxWidth: 360 }}>
          This page doesn&apos;t exist or was moved. Check the URL or head back to the dashboard.
        </p>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--accent)", color: "#fff", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          Go to Dashboard
        </Link>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-primary)", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          Home
        </Link>
      </div>
    </div>
  );
}
