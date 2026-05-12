"use client";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";

const TERMS = [
  // A
  { term: "Alpha", cat: "Performance", def: "Excess return of an investment relative to a benchmark index, after adjusting for risk." },
  { term: "Arbitrage", cat: "Strategy", def: "Simultaneously buying and selling the same asset in different markets to profit from price discrepancies." },
  { term: "Ask Price", cat: "Market Structure", def: "The lowest price a seller is willing to accept for a security." },
  { term: "ATR (Average True Range)", cat: "Technical", def: "Volatility indicator measuring the average range between high, low, and previous close over a given period." },
  { term: "At-the-Money (ATM)", cat: "Options", def: "An option whose strike price equals the current market price of the underlying asset." },
  // B
  { term: "Beta", cat: "Risk", def: "Measure of a security's volatility relative to the market. Beta > 1 means more volatile than the market." },
  { term: "Bid Price", cat: "Market Structure", def: "The highest price a buyer is willing to pay for a security." },
  { term: "Bid-Ask Spread", cat: "Market Structure", def: "The difference between the best ask and best bid price." },
  { term: "Black-Scholes Model", cat: "Options", def: "Mathematical model for pricing European-style options." },
  { term: "Bollinger Bands", cat: "Technical", def: "Volatility bands placed above and below a moving average." },
  { term: "Bull / Bear Market", cat: "Market Structure", def: "Bull market: prolonged rising prices. Bear market: decline of 20% or more." },
  // C
  { term: "Call Option", cat: "Options", def: "Contract giving the buyer the right to buy an asset at the strike price before expiration." },
  { term: "Catalyst", cat: "Event-Driven", def: "A specific event expected to cause a significant move in an asset's price." },
  { term: "CAGR", cat: "Performance", def: "Compound Annual Growth Rate." },
  { term: "Circuit Breaker", cat: "Market Structure", def: "Regulatory halt mechanism triggered by large market declines." },
  { term: "Conviction", cat: "Analysis", def: "Degree of confidence in a trade thesis." },
  { term: "Covered Call", cat: "Options", def: "Selling a call option against a long stock position to generate premium income." },
  { term: "CPI (Consumer Price Index)", cat: "Macro", def: "Measure of the average change in prices paid by consumers." },
  // D
  { term: "Dark Pool", cat: "Market Structure", def: "Private exchanges for large institutional trades." },
  { term: "DCF (Discounted Cash Flow)", cat: "Valuation", def: "Valuation method estimating future cash flows discounted to present value." },
  { term: "Delta", cat: "Options", def: "Rate of change in an option's price per $1 move in the underlying asset." },
  { term: "Drawdown", cat: "Risk", def: "Peak-to-trough decline in portfolio or asset value." },
  // E
  { term: "EBITDA", cat: "Fundamentals", def: "Earnings Before Interest, Taxes, Depreciation and Amortization." },
  { term: "EPS (Earnings Per Share)", cat: "Fundamentals", def: "Net income divided by shares outstanding." },
  { term: "EPS Surprise", cat: "Event-Driven", def: "The percentage difference between reported EPS and analyst consensus." },
  // F
  { term: "Federal Funds Rate", cat: "Macro", def: "Interest rate at which banks lend to each other overnight." },
  { term: "Float", cat: "Market Structure", def: "Number of shares available for public trading." },
  { term: "Form 4", cat: "SEC Filings", def: "SEC filing required when a company insider buys or sells stock." },
  { term: "Form 8-K", cat: "SEC Filings", def: "SEC filing disclosing material corporate events." },
  // G
  { term: "Gamma", cat: "Options", def: "Rate of change of delta per $1 move in the underlying." },
  { term: "GARP", cat: "Strategy", def: "Growth At a Reasonable Price." },
  // H
  { term: "Hedge", cat: "Risk", def: "Position taken to offset the risk of another position." },
  { term: "High-Frequency Trading (HFT)", cat: "Market Structure", def: "Algorithmic trading using extremely fast execution speeds." },
  // I
  { term: "Implied Volatility (IV)", cat: "Options", def: "Market's forecast of future volatility embedded in option prices." },
  { term: "Insider Trading", cat: "SEC Filings", def: "Trading based on material non-public information (illegal). Disclosed insider trades are legal." },
  // L
  { term: "Leverage", cat: "Risk", def: "Using borrowed capital to amplify position size." },
  { term: "Liquidity", cat: "Market Structure", def: "The ease with which an asset can be bought or sold without significantly affecting its price." },
  // M
  { term: "Margin", cat: "Risk", def: "Borrowed funds from a broker to purchase securities." },
  { term: "Market Cap", cat: "Fundamentals", def: "Total market value of a company's outstanding shares." },
  { term: "Market Maker", cat: "Market Structure", def: "A firm that continuously quotes bid and ask prices." },
  { term: "MACD", cat: "Technical", def: "Moving Average Convergence Divergence — momentum indicator." },
  { term: "Momentum", cat: "Technical", def: "Tendency for assets with strong recent performance to continue performing well." },
  // O
  { term: "Open Interest", cat: "Options", def: "Total number of outstanding option contracts not yet settled." },
  { term: "Options Chain", cat: "Options", def: "Table showing all available option contracts for an underlying." },
  { term: "OTM (Out-of-the-Money)", cat: "Options", def: "A call where strike is above current price, or put where strike is below." },
  // P
  { term: "P/E Ratio", cat: "Valuation", def: "Price-to-Earnings ratio." },
  { term: "Put Option", cat: "Options", def: "Contract giving the buyer the right to sell an asset at the strike price." },
  { term: "Put/Call Ratio", cat: "Sentiment", def: "Ratio of put volume to call volume." },
  // R
  { term: "R-Multiple", cat: "Risk", def: "Measure of trade outcome relative to initial risk." },
  { term: "RSI (Relative Strength Index)", cat: "Technical", def: "Momentum oscillator from 0–100." },
  { term: "Short Interest", cat: "Sentiment", def: "Percentage of a stock's float sold short." },
  { term: "Short Squeeze", cat: "Event-Driven", def: "Rapid price spike forcing short sellers to cover." },
  { term: "Sharpe Ratio", cat: "Performance", def: "Risk-adjusted return measure." },
  { term: "Standard Deviation", cat: "Risk", def: "Statistical measure of price dispersion." },
  { term: "Stop Loss", cat: "Risk", def: "Order to automatically sell when price reaches a predetermined level." },
  // T
  { term: "Theta", cat: "Options", def: "Rate of time decay in an option's value." },
  { term: "Theta Gang", cat: "Strategy", def: "Strategy of selling options to collect premium and benefit from time decay." },
  { term: "TWAP", cat: "Execution", def: "Time-Weighted Average Price execution strategy." },
  // V
  { term: "VWAP", cat: "Technical", def: "Volume-Weighted Average Price." },
  { term: "VIX", cat: "Macro", def: "CBOE Volatility Index — the market's 'fear gauge'." },
  { term: "Vega", cat: "Options", def: "Sensitivity of an option's price to a 1% change in implied volatility." },
  // W
  { term: "Wash Sale Rule", cat: "Tax", def: "IRS rule disallowing a tax loss if you repurchase a substantially identical security within 30 days." },
  // Y
  { term: "Yield Curve", cat: "Macro", def: "Graph of bond yields across maturities." },
];

const CATS = ["All", ...Array.from(new Set(TERMS.map(t => t.cat))).sort()];

const CAT_COLORS: Record<string, string> = {
  "Technical": "var(--accent)", "Options": "var(--bull)", "Risk": "var(--bear)",
  "Macro": "var(--gold)", "Performance": "var(--text-secondary)", "Strategy": "#a78bfa",
  "Fundamentals": "#34d399", "Valuation": "#f59e0b", "Event-Driven": "#ec4899",
  "SEC Filings": "var(--accent)", "Market Structure": "var(--text-muted)",
  "Sentiment": "#67e8f9", "Analysis": "#c084fc", "Tax": "#fb923c", "Execution": "#94a3b8",
};

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return TERMS.filter(t => {
      const matchCat = cat === "All" || t.cat === cat;
      const matchQ = !q || 
        t.term.toLowerCase().includes(q) || 
        t.def.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [search, cat]);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 72px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 8 }}>Reference</div>
        <h1 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>Financial Glossary</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>{TERMS.length}+ terms covering options, technicals, macro, SEC filings, and event-driven trading.</p>
      </div>

      {/* Search + filter */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 280px" }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}/>
          <input
            value={search} 
            onChange={e => setSearch(e.target.value)}
            placeholder="Search terms…"
            style={{ width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-medium)", borderRadius: 8, padding: "10px 13px 10px 36px", fontSize: 14, color: "var(--text-primary)", outline: "none" }}
          />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {CATS.map(c => (
            <button 
              key={c} 
              onClick={() => setCat(c)} 
              style={{ 
                padding: "6px 13px", 
                borderRadius: 20, 
                background: cat === c ? "var(--accent)" : "var(--bg-elevated)", 
                color: cat === c ? "#fff" : "var(--text-secondary)", 
                border: `1px solid ${cat === c ? "transparent" : "var(--border-medium)"}`, 
                fontSize: 11, 
                fontWeight: 500, 
                cursor: "pointer", 
                whiteSpace: "nowrap" 
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
        {filtered.length} term{filtered.length !== 1 ? "s" : ""}
        {(search || cat !== "All") ? ` matching "${search || cat}"` : ""}
      </div>

      {/* Terms grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
        {filtered.map(({ term, cat: c, def }) => {
          const cc = CAT_COLORS[c] ?? "var(--text-muted)";
          return (
            <div key={term} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{term}</h3>
                <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, color: cc, background: `${cc}18`, border: `1px solid ${cc}30`, whiteSpace: "nowrap", marginLeft: 8 }}>{c}</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{def}</p>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          <p>No terms matching &ldquo;{search}&rdquo;. Try a different search.</p>
        </div>
      )}
    </div>
  );
}
