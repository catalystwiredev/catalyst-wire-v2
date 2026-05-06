"use client";
import { useState } from "react";
import { Newspaper, TrendingUp, FlaskConical, Bitcoin, Landmark, BarChart2, Lock } from "lucide-react";
import Link from "next/link";
import { NewsCard } from "./NewsCard";
import dayjs from "dayjs";

const CATEGORIES = [
  { id: "all",      label: "All News",      icon: Newspaper, keywords: [] },
  { id: "market",   label: "Market",        icon: TrendingUp, keywords: ["market","stock","equity","index","nasdaq","s&p","dow","fed","rate","treasury"] },
  { id: "biotech",  label: "Biotech / FDA", icon: FlaskConical, keywords: ["fda","biotech","drug","clinical","trial","cancer","pharma","pdufa","approval","bla","nda"] },
  { id: "crypto",   label: "Crypto",        icon: Bitcoin, keywords: ["bitcoin","crypto","ethereum","btc","eth","blockchain","defi","nft","coinbase","binance"] },
  { id: "congress", label: "Congressional", icon: Landmark, keywords: ["congress","senate","house","legislation","bill","act","government","trump","biden","tariff","trade"] },
  { id: "earnings", label: "Earnings",      icon: BarChart2, keywords: ["earnings","revenue","eps","quarter","profit","guidance","beat","miss","results"] },
];

interface Article {
  id: string; title: string; summary?: string; url: string;
  source: string; publishedAt: string; sentiment: string; score: number; tickers: string[];
}

function matchesCategory(article: Article, categoryId: string): boolean {
  if (categoryId === "all") return true;
  const cat = CATEGORIES.find(c => c.id === categoryId);
  if (!cat || !cat.keywords.length) return true;
  const text = `${article.title} ${article.summary ?? ""} ${(article.tickers ?? []).join(" ")}`.toLowerCase();
  return cat.keywords.some(k => text.includes(k));
}

export function NewsClient({ articles, lockedCount }: { articles: Article[]; lockedCount: number }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = articles.filter(a => matchesCategory(a, activeCategory));
  const visible = filtered.slice(0, 6);
  const lockedFiltered = filtered.slice(6);

  return (
    <>
      {/* Category filter row */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        {CATEGORIES.map(({ id, label, icon: Icon }) => {
          const active = activeCategory === id;
          return (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 16px", borderRadius: 20, cursor: "pointer",
                background: active ? "var(--accent)" : "var(--bg-elevated)",
                color: active ? "#fff" : "var(--text-secondary)",
                border: active ? "1px solid var(--accent)" : "1px solid var(--border-medium)",
                fontSize: 12, fontWeight: active ? 600 : 400,
                transition: "all 0.15s",
              }}>
              <Icon size={12}/> {label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)", fontSize: 13 }}>
          No {activeCategory === "all" ? "" : activeCategory + " "}articles found right now.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {visible.map(item => (
            <NewsCard key={item.id} item={item} date={dayjs(item.publishedAt).format("MMM D")} />
          ))}

          {lockedFiltered.length > 0 && (
            <div style={{ position: "relative" }}>
              {lockedFiltered.slice(0, 6).map(item => (
                <div key={item.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 2, filter: "blur(2px)", pointerEvents: "none", userSelect: "none" }}>
                  <div style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--accent)", fontSize: 13, minWidth: 52 }}>
                    {item.tickers[0] ? `$${item.tickers[0]}` : "MKT"}
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>{item.title}</p>
                </div>
              ))}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 0%, var(--bg-base) 60%)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 24 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 12, padding: "18px 28px", textAlign: "center" }}>
                  <Lock size={18} style={{ color: "var(--accent)" }}/>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>{lockedFiltered.length} more articles available with Alpha</p>
                  <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--accent)", color: "#fff", padding: "8px 18px", borderRadius: 7, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                    Upgrade to Alpha
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
