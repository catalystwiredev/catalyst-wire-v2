"use client";
import { useState } from "react";
import { CreditCard } from "lucide-react";

export function BillingPortalButton() {
  const [loading, setLoading] = useState(false);

  async function openPortal() {
    setLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const { url, error } = await res.json();
    if (url) window.location.href = url;
    else { alert(error ?? "No billing account found."); setLoading(false); }
  }

  return (
    <button onClick={openPortal} disabled={loading} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--bg-elevated)", color: "var(--text-primary)", border: "1px solid var(--border-medium)", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
      <CreditCard size={13} /> {loading ? "Loading..." : "Manage billing"}
    </button>
  );
}
