"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Star, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";

type AssetType = "stock" | "etf" | "crypto" | "forex" | "futures" | "option";

interface WatchlistItem {
  id: string;
  symbol: string;
  name: string | null;
  asset_type: AssetType;
  added_at: string;
}

const TYPE_COLORS: Record<AssetType, string> = {
  stock: "var(--accent)", etf: "var(--bull)", crypto: "#f59e0b",
  forex: "#a78bfa", futures: "#fb923c", option: "#ec4899",
};

export default function WatchlistPage() {
  const [items,    setItems]    = useState<WatchlistItem[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [adding,   setAdding]   = useState(false);
  const [symbol,   setSymbol]   = useState("");
  const [name,     setName]     = useState("");
  const [assetType,setAssetType]= useState<AssetType>("stock");
  const [error,    setError]    = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/watchlist");
      if (res.status === 401) { setError("Please sign in to view your watchlist."); return; }
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      setError("Failed to load watchlist.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!symbol.trim()) return;
    setAdding(true);
    setError("");
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: symbol.trim().toUpperCase(), name: name.trim(), assetType }),
      });
      if (!res.ok) throw new Error();
      setSymbol(""); setName("");
      await load();
    } catch {
      setError("Failed to add symbol.");
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove(sym: string) {
    setDeleting(sym);
    try {
      await fetch(`/api/watchlist?symbol=${sym}`, { method: "DELETE" });
      setItems(prev => prev.filter(i => i.symbol !== sym));
    } catch {
      setError("Failed to remove symbol.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px 72px" }}>
      <div style={{ marginBottom: 32, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 8 }}>Portfolio</div>
          <h1 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>Watchlist</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Track symbols across stocks, ETFs, crypto, forex, futures, and options.</p>
        </div>
        <button onClick={load} title="Refresh" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--bg-elevated)", border: "1px solid var(--border-medium)", color: "var(--text-secondary)", padding: "8px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
          <RefreshCw size={13}/> Refresh
        </button>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 14, padding: "20px 22px", marginBottom: 24, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: "1 1 100px", minWidth: 100 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Symbol</label>
          <input value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())} placeholder="AAPL" required
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-medium)", borderRadius: 8, padding: "9px 12px", fontSize: 14, fontFamily: "monospace", fontWeight: 700, color: "var(--accent)", outline: "none", width: "100%" }}/>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: "2 1 180px" }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Name (optional)</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Apple Inc."
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-medium)", borderRadius: 8, padding: "9px 12px", fontSize: 14, color: "var(--text-primary)", outline: "none", width: "100%" }}/>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: "1 1 120px" }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Type</label>
          <select value={assetType} onChange={e => setAssetType(e.target.value as AssetType)}
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-medium)", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "var(--text-primary)", outline: "none", cursor: "pointer" }}>
            {(["stock","etf","crypto","forex","futures","option"] as AssetType[]).map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={adding} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--accent)", color: "#fff", border: "none", padding: "10px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: adding ? "not-allowed" : "pointer", opacity: adding ? 0.7 : 1, flexShrink: 0 }}>
          {adding ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }}/> : <Plus size={14}/>}
          Add
        </button>
      </form>

      {error && (
        <div style={{ background: "var(--bear)15", border: "1px solid var(--bear)40", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "var(--bear)", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {error}
          {error.includes("sign in") && <Link href="/login" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>Sign in →</Link>}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: 10, color: "var(--text-muted)" }}>
          <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }}/> Loading…
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Star size={32} style={{ color: "var(--text-muted)", marginBottom: 12 }}/>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 6 }}>Your watchlist is empty</p>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Add a symbol above to start tracking.</p>
        </div>
      ) : (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 14, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 100px 140px 44px", padding: "9px 18px", borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}>
            {["Symbol", "Name", "Type", "Added", ""].map(h => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: "var(--text-muted)", textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>
          {items.map(item => {
            const tc = TYPE_COLORS[item.asset_type] ?? "var(--text-muted)";
            return (
              <div key={item.id} style={{ display: "grid", gridTemplateColumns: "90px 1fr 100px 140px 44px", padding: "12px 18px", borderBottom: "1px solid var(--border)", alignItems: "center", fontSize: 13 }}>
                <div style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--accent)", fontSize: 14 }}>{item.symbol}</div>
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-secondary)" }}>{item.name || "—"}</div>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, color: tc, background: `${tc}18`, border: `1px solid ${tc}30` }}>
                    {item.asset_type.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: "var(--text-muted)" }}>
                  {new Date(item.added_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
                <button onClick={() => handleRemove(item.symbol)} disabled={deleting === item.symbol}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, background: "transparent", border: "1px solid var(--border-medium)", borderRadius: 6, cursor: "pointer", color: "var(--text-muted)", transition: "all 0.15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--bear)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--bear)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-medium)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}>
                  {deleting === item.symbol ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }}/> : <Trash2 size={12}/>}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
