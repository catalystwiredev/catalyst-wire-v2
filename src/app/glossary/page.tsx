"use client";
import { useState } from "react";
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
  { term: "Bid-Ask Spread", cat: "Market Structure", def: "The difference between the best ask and best bid price; a proxy for transaction cost and liquidity." },
  { term: "Black-Scholes Model", cat: "Options", def: "Mathematical model for pricing European-style options, based on volatility, time to expiry, and interest rates." },
  { term: "Bollinger Bands", cat: "Technical", def: "Volatility bands placed above and below a moving average, based on standard deviations of price." },
  { term: "Bull / Bear Market", cat: "Market Structure", def: "A bull market is a prolonged period of rising prices (>20%); a bear market is a decline of 20% or more." },
  // C
  { term: "Call Option", cat: "Options", def: "Contract giving the buyer the right (not obligation) to buy an asset at the strike price before expiration." },
  { term: "Catalyst", cat: "Event-Driven", def: "A specific event expected to cause a significant move in an asset's price — earnings, FDA decisions, M&A, etc." },
  { term: "CAGR", cat: "Performance", def: "Compound Annual Growth Rate — the rate at which an investment grows annually over a specified period." },
  { term: "Circuit Breaker", cat: "Market Structure", def: "Regulatory halt mechanism triggered when an index falls by a set percentage, pausing trading temporarily." },
  { term: "Conviction", cat: "Analysis", def: "Degree of confidence in a trade thesis, often scored A–F or 1–10 based on signal strength and data quality." },
  { term: "Covered Call", cat: "Options", def: "Selling a call option against a long stock position to generate premium income, capping upside potential." },
  { term: "CPI (Consumer Price Index)", cat: "Macro", def: "Measure of the average change in prices paid by consumers for goods and services; key inflation indicator." },
  // D
  { term: "Dark Pool", cat: "Market Structure", def: "Private exchanges where large institutional trades are executed off public exchanges to minimize market impact." },
  { term: "DCF (Discounted Cash Flow)", cat: "Valuation", def: "Valuation method estimating future cash flows and discounting them back to present value using a discount rate." },
  { term: "Delta", cat: "Options", def: "Rate of change in an option's price per $1 move in the underlying asset. Ranges from 0 to 1 for calls, -1 to 0 for puts." },
  { term: "Drawdown", cat: "Risk", def: "Peak-to-trough decline in portfolio or asset value, expressed as a percentage." },
  // E
  { term: "EBITDA", cat: "Fundamentals", def: "Earnings Before Interest, Taxes, Depreciation and Amortization — a proxy for operating profitability." },
  { term: "EPS (Earnings Per Share)", cat: "Fundamentals", def: "Net income divided by shares outstanding. A key metric for evaluating corporate profitability per share." },
  { term: "EPS Surprise", cat: "Event-Driven", def: "The percentage difference between reported EPS and analyst consensus estimates. Positive surprises drive price moves." },
  // F
  { term: "Federal Funds Rate", cat: "Macro", def: "Interest rate at which banks lend to each other overnight; the primary policy tool of the Federal Reserve." },
  { term: "Float", cat: "Market Structure", def: "Number of shares available for public trading. Low float stocks are more susceptible to volatile moves." },
  { term: "Form 4", cat: "SEC Filings", def: "SEC filing required within 2 business days when a company insider buys or sells company stock." },
  { term: "Form 8-K", cat: "SEC Filings", def: "SEC filing disclosing material corporate events: earnings, mergers, executive changes, and more." },
  // G
  { term: "Gamma", cat: "Options", def: "Rate of change of delta per $1 move in the underlying. High gamma means delta can shift rapidly near expiry." },
  { term: "GARP", cat: "Strategy", def: "Growth At a Reasonable Price — investing in growing companies without overpaying for the growth." },
  // H
  { term: "Hedge", cat: "Risk", def: "Position taken to offset the risk of another position — e.g., buying a put option against a long stock holding." },
  { term: "High-Frequency Trading (HFT)", cat: "Market Structure", def: "Algorithmic trading using extremely fast execution speeds to exploit small price inefficiencies." },
  // I
  { term: "Implied Volatility (IV)", cat: "Options", def: "Market's forecast of future volatility embedded in option prices. High IV means expensive options." },
  { term: "Insider Trading", cat: "SEC Filings", def: "Trading based on material non-public information; illegal. Disclosed insider trades (Form 4) are legal and trackable." },
  // L
  { term: "Leverage", cat: "Risk", def: "Using borrowed capital to amplify position size. Amplifies both gains and losses." },
  { term: "Liquidity", cat: "Market Structure", def: "The ease with which an asset can be bought or sold without significantly affecting its price." },
  // M
  { term: "Margin", cat: "Risk", def: "Borrowed funds from a broker to purchase securities. Margin call occurs when account equity falls below minimum." },
  { term: "Market Cap", cat: "Fundamentals", def: "Total market value of a company's outstanding shares. Calculated as: share price × shares outstanding." },
  { term: "Market Maker", cat: "Market Structure", def: "A firm that continuously quotes bid and ask prices, providing liquidity in exchange for the spread." },
  { term: "MACD", cat: "Technical", def: "Moving Average Convergence Divergence — momentum indicator showing the relationship between two EMAs." },
  { term: "Momentum", cat: "Technical", def: "Tendency for assets with strong recent performance to continue performing well in the near term." },
  // O
  { term: "Open Interest", cat: "Options", def: "Total number of outstanding option contracts not yet settled. Rising OI with rising price confirms a trend." },
  { term: "Options Chain", cat: "Options", def: "Table showing all available option contracts for an underlying, organized by strike and expiration." },
  { term: "OTM (Out-of-the-Money)", cat: "Options", def: "A call option where the strike is above the current price, or a put where the strike is below." },
  // P
  { term: "P/E Ratio", cat: "Valuation", def: "Price-to-Earnings ratio. Current share price divided by earnings per share. Higher P/E implies more growth expectations." },
  { term: "Put Option", cat: "Options", def: "Contract giving the buyer the right to sell an asset at the strike price before expiration." },
  { term: "Put/Call Ratio", cat: "Sentiment", def: "Ratio of put volume to call volume. High ratio signals bearish sentiment; low signals bullishness." },
  // R
  { term: "R-Multiple", cat: "Risk", def: "Measure of trade outcome relative to initial risk. A 3R trade earns 3× the amount you risked." },
  { term: "RSI (Relative Strength Index)", cat: "Technical", def: "Momentum oscillator from 0–100. Above 70 = overbought; below 30 = oversold." },
  // S
  { term: "Short Interest", cat: "Sentiment", def: "Percentage of a stock's float sold short. High short interest can lead to short squeezes." },
  { term: "Short Squeeze", cat: "Event-Driven", def: "Rapid price spike forcing short sellers to cover positions, accelerating the upward move." },
  { term: "Sharpe Ratio", cat: "Performance", def: "Risk-adjusted return measure. (Return − Risk-free rate) / Standard deviation. Higher is better." },
  { term: "Standard Deviation", cat: "Risk", def: "Statistical measure of price dispersion. Higher σ = higher volatility." },
  { term: "Stop Loss", cat: "Risk", def: "Order to automatically sell a position when price reaches a predetermined level to limit losses." },
  // T
  { term: "Theta", cat: "Options", def: "Rate of time decay in an option's value per day. Short options benefit from positive theta; long options lose." },
  { term: "Theta Gang", cat: "Strategy", def: "Strategy of selling options to collect premium and benefit from time decay." },
  { term: "TWAP", cat: "Execution", def: "Time-Weighted Average Price — strategy to execute a large order distributed evenly across a time period." },
  // V
  { term: "VWAP", cat: "Technical", def: "Volume-Weighted Average Price — the average price weighted by volume. Used as intraday benchmark." },
  { term: "VIX", cat: "Macro", def: "CBOE Volatility Index. Measures expected 30-day S&P 500 volatility. Often called the market's 'fear gauge'." },
  { term: "Vega", cat: "Options", def: "Sensitivity of an option's price to a 1% change in implied volatility." },
  // W
  { term: "Wash Sale Rule", cat: "Tax", def: "IRS rule disallowing a tax loss if you repurchase a substantially identical security within 30 days." },
  // Y
  { term: "Yield Curve", cat: "Macro", def: "Graph of bond yields across maturities. Inverted yield curve (short rates > long rates) historically precedes recessions." },
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
  const [cat,    setCat]    = useState("All");

  const filtered = TERMS.filter(t => {
    const matchCat = cat === "All" || t.cat === cat;
    const q = search.toLowerCase();
    const matchQ = !q || t.term.toLowerCase().includes(q) || t.def.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

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
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search terms…"
            style={{ width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-medium)", borderRadius: 8, padding: "10px 13px 10px 36px", fontSize: 14, color: "var(--text-primary)", outline: "none" }}
          />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ padding: "6px 13px", borderRadius: 20, background: cat === c ? "var(--accent)" : "var(--bg-elevated)", color: cat === c ? "#fff" : "var(--text-secondary)", border: `1px solid ${cat === c ? "transparent" : "var(--border-medium)"}`, fontSize: 11, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>
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
