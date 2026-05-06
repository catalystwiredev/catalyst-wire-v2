import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";
import { FDAApplicationsTable, FDARecallsTable } from "@/components/tables/FDATable";

export const revalidate = 3600;

async function getFDAData() {
  try {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/fda`, { next: { revalidate: 3600 } });
    if (!res.ok) return { applications: [], recalls: [] };
    return await res.json();
  } catch { return { applications: [], recalls: [] }; }
}

export default async function FDADecisionsPage() {
  const { applications, recalls } = await getFDAData();

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "#f472b6", textTransform: "uppercase", marginBottom: 8 }}>OpenFDA · Biotech</div>
          <h1 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6 }}>FDA Decisions</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Live NDA, BLA, and drug application data from the FDA drug database.</p>
        </div>
        <Link href="/register?plan=alpha" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#fff", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          Unlock PDUFA calendar <ArrowRight size={14} />
        </Link>
      </div>

      <div style={{ marginBottom: 32 }}>
        {applications.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--text-secondary)" }}>
            <FlaskConical size={28} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
            <div>No applications found at this time.</div>
          </div>
        ) : (
          <FDAApplicationsTable applications={applications} />
        )}
      </div>

      {recalls.length > 0 && (
        <FDARecallsTable recalls={recalls} />
      )}
    </div>
  );
}
