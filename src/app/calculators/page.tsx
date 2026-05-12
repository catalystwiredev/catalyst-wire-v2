"use client";
import { useState } from "react";
import { Calculator, TrendingUp, DollarSign, Percent, BarChart2, Layers } from "lucide-react";

const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-medium)",
  borderRadius: 8, padding: "10px 13px", fontSize: 14, color: "var(--text-primary)", outline: "none",
};
const labelStyle: React.CSSProperties = { 
  fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 5, display: "block" 
};
const resultStyle: React.CSSProperties = { 
  background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px", marginTop: 16 
};

function fmt(n: number, decimals = 2): string {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
function fmtUsd(n: number): string { return "$" + fmt(n); }
function fmtPct(n: number): string { return fmt(n) + "%"; }

// ——— P&L Calculator ———
function PnL() {
  const [entry, setEntry] = useState("100");
  const [exit, setExit] = useState("125");
  const [qty, setQty] = useState("100");
  const [fees, setFees] = useState("0");

  const e = parseFloat(entry) || 0;
  const x = parseFloat(exit) || 0;
  const q = parseFloat(qty) || 0;
  const f = parseFloat(fees) || 0;

  const gross = (x - e) * q;
  const net = gross - f;
  const pct = e !== 0 ? ((x - e) / e) * 100 : 0;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div><label style={labelStyle}>Entry Price</label><input style={inputStyle} type="number" value={entry} onChange={e => setEntry(e.target.value)}/></div>
        <div><label style={labelStyle}>Exit Price</label><input style={inputStyle} type="number" value={exit} onChange={e => setExit(e.target.value)}/></div>
        <div><label style={labelStyle}>Shares / Contracts</label><input style={inputStyle} type="number" value={qty} onChange={e => setQty(e.target.value)}/></div>
        <div><label style={labelStyle}>Total Fees ($)</label><input style={inputStyle} type="number" value={fees} onChange={e => setFees(e.target.value)}/></div>
      </div>
      <div style={resultStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div><div style={labelStyle}>Gross P&L</div><div style={{ fontSize: 20, fontWeight: 700, fontFamily: "monospace", color: gross >= 0 ? "var(--bull)" : "var(--bear)" }}>{fmtUsd(gross)}</div></div>
          <div><div style={labelStyle}>Net P&L</div><div style={{ fontSize: 20, fontWeight: 700, fontFamily: "monospace", color: net >= 0 ? "var(--bull)" : "var(--bear)" }}>{fmtUsd(net)}</div></div>
          <div><div style={labelStyle}>Return %</div><div style={{ fontSize: 20, fontWeight: 700, fontFamily: "monospace", color: pct >= 0 ? "var(--bull)" : "var(--bear)" }}>{fmtPct(pct)}</div></div>
        </div>
      </div>
    </div>
  );
}

// ——— DCA Calculator ———
function DCA() {
  const [amount, setAmount] = useState("200");
  const [months, setMonths] = useState("12");
  const [initPrice, setInitPrice] = useState("50");
  const [finalPrice, setFinalPrice] = useState("75");

  const a = parseFloat(amount) || 0;
  const m = parseInt(months) || 0;
  const ip = parseFloat(initPrice) || 0;
  const fp = parseFloat(finalPrice) || 0;

  const totalInvested = a * m;
  const totalShares = m > 0 ? (a / ip) + (a / fp) * (m - 1) : 0;
  const currentValue = totalShares * fp;
  const gain = currentValue - totalInvested;
  const avgPrice = m > 0 ? totalInvested / totalShares : 0;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div><label style={labelStyle}>Monthly Investment ($)</label><input style={inputStyle} type="number" value={amount} onChange={e => setAmount(e.target.value)}/></div>
        <div><label style={labelStyle}>Months</label><input style={inputStyle} type="number" value={months} onChange={e => setMonths(e.target.value)}/></div>
        <div><label style={labelStyle}>Starting Price ($)</label><input style={inputStyle} type="number" value={initPrice} onChange={e => setInitPrice(e.target.value)}/></div>
        <div><label style={labelStyle}>Current Price ($)</label><input style={inputStyle} type="number" value={finalPrice} onChange={e => setFinalPrice(e.target.value)}/></div>
      </div>
      <div style={resultStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          <div><div style={labelStyle}>Total Invested</div><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace" }}>{fmtUsd(totalInvested)}</div></div>
          <div><div style={labelStyle}>Current Value</div><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace", color: "var(--bull)" }}>{fmtUsd(currentValue)}</div></div>
          <div><div style={labelStyle}>Gain / Loss</div><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace", color: gain >= 0 ? "var(--bull)" : "var(--bear)" }}>{fmtUsd(gain)}</div></div>
          <div><div style={labelStyle}>Avg Cost Basis</div><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace" }}>{fmtUsd(avgPrice)}</div></div>
        </div>
      </div>
    </div>
  );
}

// ——— Position Size Calculator ———
function PositionSize() {
  const [capital, setCapital] = useState("25000");
  const [risk, setRisk] = useState("1");
  const [entry, setEntry] = useState("150");
  const [stop, setStop] = useState("142");

  const c = parseFloat(capital) || 0;
  const r = parseFloat(risk) / 100 || 0;
  const e = parseFloat(entry) || 0;
  const s = parseFloat(stop) || 0;

  const riskAmount = c * r;
  const stopDist = Math.abs(e - s) || 1;
  const shares = Math.floor(riskAmount / stopDist);
  const posValue = shares * e;
  const positionPct = c > 0 ? (posValue / c) * 100 : 0;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div><label style={labelStyle}>Account Capital ($)</label><input style={inputStyle} type="number" value={capital} onChange={e => setCapital(e.target.value)}/></div>
        <div><label style={labelStyle}>Risk per Trade (%)</label><input style={inputStyle} type="number" step="0.1" value={risk} onChange={e => setRisk(e.target.value)}/></div>
        <div><label style={labelStyle}>Entry Price ($)</label><input style={inputStyle} type="number" value={entry} onChange={e => setEntry(e.target.value)}/></div>
        <div><label style={labelStyle}>Stop Loss ($)</label><input style={inputStyle} type="number" value={stop} onChange={e => setStop(e.target.value)}/></div>
      </div>
      <div style={resultStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          <div><div style={labelStyle}>Shares to Buy</div><div style={{ fontSize: 20, fontWeight: 700, fontFamily: "monospace", color: "var(--accent)" }}>{isFinite(shares) ? shares : "—"}</div></div>
          <div><div style={labelStyle}>Risk Amount</div><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace", color: "var(--bear)" }}>{fmtUsd(riskAmount)}</div></div>
          <div><div style={labelStyle}>Position Value</div><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace" }}>{fmtUsd(posValue)}</div></div>
          <div><div style={labelStyle}>% of Portfolio</div><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace" }}>{fmtPct(positionPct)}</div></div>
        </div>
      </div>
    </div>
  );
}

// ——— Compound Growth Calculator ———
function CompoundGrowth() {
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("10");
  const [monthly, setMonthly] = useState("200");

  const p = parseFloat(principal) || 0;
  const r = parseFloat(rate) / 100 || 0;
  const y = parseInt(years) || 0;
  const m = parseFloat(monthly) || 0;

  const futureValue = p * Math.pow(1 + r, y) + m * ((Math.pow(1 + r / 12, y * 12) - 1) / (r / 12));
  const totalContrib = p + m * y * 12;
  const totalGain = futureValue - totalContrib;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div><label style={labelStyle}>Initial Investment ($)</label><input style={inputStyle} type="number" value={principal} onChange={e => setPrincipal(e.target.value)}/></div>
        <div><label style={labelStyle}>Annual Return (%)</label><input style={inputStyle} type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)}/></div>
        <div><label style={labelStyle}>Years</label><input style={inputStyle} type="number" value={years} onChange={e => setYears(e.target.value)}/></div>
        <div><label style={labelStyle}>Monthly Contribution ($)</label><input style={inputStyle} type="number" value={monthly} onChange={e => setMonthly(e.target.value)}/></div>
      </div>
      <div style={resultStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          <div><div style={labelStyle}>Future Value</div><div style={{ fontSize: 20, fontWeight: 700, fontFamily: "monospace", color: "var(--bull)" }}>{fmtUsd(futureValue)}</div></div>
          <div><div style={labelStyle}>Total Contributed</div><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace" }}>{fmtUsd(totalContrib)}</div></div>
          <div><div style={labelStyle}>Total Gain</div><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace", color: "var(--accent)" }}>{fmtUsd(totalGain)}</div></div>
        </div>
      </div>
    </div>
  );
}

// ——— Dividend Yield Calculator ———
function DividendYield() {
  const [price, setPrice] = useState("150");
  const [annual, setAnnual] = useState("3.60");
  const [shares, setShares] = useState("100");
  const [growth, setGrowth] = useState("5");
  const [years, setYears] = useState("10");

  const p = parseFloat(price) || 0;
  const a = parseFloat(annual) || 0;
  const s = parseFloat(shares) || 0;
  const g = parseFloat(growth) / 100 || 0;
  const y = parseInt(years) || 0;

  const yieldPct = p > 0 ? (a / p) * 100 : 0;
  const annualIncome = a * s;
  const futureDiv = a * Math.pow(1 + g, y);
  const futureYield = p > 0 ? (futureDiv / p) * 100 : 0;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div><label style={labelStyle}>Stock Price ($)</label><input style={inputStyle} type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)}/></div>
        <div><label style={labelStyle}>Annual Dividend ($)</label><input style={inputStyle} type="number" step="0.01" value={annual} onChange={e => setAnnual(e.target.value)}/></div>
        <div><label style={labelStyle}>Shares Owned</label><input style={inputStyle} type="number" value={shares} onChange={e => setShares(e.target.value)}/></div>
        <div><label style={labelStyle}>Dividend Growth Rate (%)</label><input style={inputStyle} type="number" step="0.1" value={growth} onChange={e => setGrowth(e.target.value)}/></div>
        <div><label style={labelStyle}>Years to Project</label><input style={inputStyle} type="number" value={years} onChange={e => setYears(e.target.value)}/></div>
      </div>
      <div style={resultStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          <div><div style={labelStyle}>Current Yield</div><div style={{ fontSize: 20, fontWeight: 700, fontFamily: "monospace", color: "var(--bull)" }}>{fmtPct(yieldPct)}</div></div>
          <div><div style={labelStyle}>Annual Income</div><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace" }}>{fmtUsd(annualIncome)}</div></div>
          <div><div style={labelStyle}>Future Dividend</div><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace", color: "var(--accent)" }}>{fmtUsd(futureDiv)}</div></div>
          <div><div style={labelStyle}>Yield on Cost ({years}yr)</div><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace" }}>{fmtPct(futureYield)}</div></div>
        </div>
      </div>
    </div>
  );
}

// ——— Covered Call Calculator ———
function CoveredCall() {
  const [stockPrice, setStockPrice] = useState("150");
  const [premium, setPremium] = useState("3.50");
  const [strike, setStrike] = useState("155");
  const [shares, setShares] = useState("100");

  const sp = parseFloat(stockPrice) || 0;
  const pr = parseFloat(premium) || 0;
  const st = parseFloat(strike) || 0;
  const sh = parseFloat(shares) || 0;

  const premiumIncome = pr * sh;
  const maxProfit = (st - sp + pr) * sh;
  const breakeven = sp - pr;
  const returnOnStock = sp > 0 ? (pr / sp) * 100 : 0;
  const cappedAt = st;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div><label style={labelStyle}>Stock Price ($)</label><input style={inputStyle} type="number" step="0.01" value={stockPrice} onChange={e => setStockPrice(e.target.value)}/></div>
        <div><label style={labelStyle}>Call Premium ($)</label><input style={inputStyle} type="number" step="0.01" value={premium} onChange={e => setPremium(e.target.value)}/></div>
        <div><label style={labelStyle}>Strike Price ($)</label><input style={inputStyle} type="number" step="0.01" value={strike} onChange={e => setStrike(e.target.value)}/></div>
        <div><label style={labelStyle}>Shares Owned</label><input style={inputStyle} type="number" value={shares} onChange={e => setShares(e.target.value)}/></div>
      </div>
      <div style={resultStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
          <div><div style={labelStyle}>Premium Income</div><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace", color: "var(--bull)" }}>{fmtUsd(premiumIncome)}</div></div>
          <div><div style={labelStyle}>Max Profit</div><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace", color: "var(--bull)" }}>{fmtUsd(maxProfit)}</div></div>
          <div><div style={labelStyle}>Breakeven</div><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace" }}>{fmtUsd(breakeven)}</div></div>
          <div><div style={labelStyle}>Return on Stock</div><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace", color: "var(--accent)" }}>{fmtPct(returnOnStock)}</div></div>
          <div><div style={labelStyle}>Upside Capped At</div><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace" }}>{fmtUsd(cappedAt)}</div></div>
        </div>
      </div>
    </div>
  );
}

const CALCS = [
  { id: "pnl", label: "P&L", icon: TrendingUp, desc: "Trade profit & loss with fees", component: PnL },
  { id: "dca", label: "DCA", icon: Layers, desc: "Dollar-cost averaging analysis", component: DCA },
  { id: "position", label: "Position Size", icon: BarChart2, desc: "Risk-based share quantity sizing", component: PositionSize },
  { id: "compound", label: "Investment Growth", icon: DollarSign, desc: "Compound interest with contributions", component: CompoundGrowth },
  { id: "dividend", label: "Dividend Yield", icon: Percent, desc: "Yield, income & growth projection", component: DividendYield },
  { id: "call", label: "Covered Call", icon: Calculator, desc: "Premium income & max profit analysis", component: CoveredCall },
];

export default function CalculatorsPage() {
  const [active, setActive] = useState("pnl");
  const current = CALCS.find(c => c.id === active)!;
  const Component = current.component;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px 72px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 8 }}>Tools</div>
        <h1 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>Financial Calculators</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Practical tools for trading analysis, risk management, and investment planning.</p>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 28 }}>
        {CALCS.map(({ id, label, icon: Icon }) => (
          <button 
            key={id} 
            onClick={() => setActive(id)} 
            style={{ 
              display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 8, 
              background: active === id ? "var(--accent)" : "var(--bg-elevated)", 
              color: active === id ? "#fff" : "var(--text-secondary)", 
              border: `1px solid ${active === id ? "transparent" : "var(--border-medium)"}`, 
              fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.15s" 
            }}
          >
            <Icon size={13}/> {label}
          </button>
        ))}
      </div>

      {/* Active calculator */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 14, padding: "24px" }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <current.icon size={18} style={{ color: "var(--accent)" }}/>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>{current.label} Calculator</h2>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{current.desc}</p>
        </div>
        <Component />
      </div>
    </div>
  );
}
