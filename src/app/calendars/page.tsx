import Link from "next/link";
import { Calendar, FlaskConical, BarChart2, Rocket, Lock, ArrowRight } from "lucide-react";

const FDA_EVENTS = [
  { ticker:"MRNA",  drug:"mRNA-1283 (flu vaccine)",              date:"May 12, 2026",  type:"PDUFA",         score:91, verdict:"APPROVAL", free:true },
  { ticker:"BIIB",  drug:"lecanemab (Alzheimer's)",              date:"May 19, 2026",  type:"AdCom Vote",    score:84, verdict:"POSITIVE",  free:true },
  { ticker:"SGEN",  drug:"enfortumab vedotin + pembro",          date:"Jun 3, 2026",   type:"PDUFA",         score:79, verdict:"APPROVAL",  free:false },
  { ticker:"RXMD",  drug:"RX-0301 (pain)",                       date:"Jun 18, 2026",  type:"PDUFA",         score:55, verdict:"CRL RISK",  free:false },
  { ticker:"FATE",  drug:"FT596 (CD19 NK cell therapy)",         date:"Jul 7, 2026",   type:"PDUFA",         score:71, verdict:"POSSIBLE",  free:false },
  { ticker:"BLUE",  drug:"betibeglogene (gene therapy)",         date:"Jul 22, 2026",  type:"Panel Vote",    score:82, verdict:"POSITIVE",  free:false },
];

const EARNINGS = [
  { ticker:"TSLA",  report:"Q1 2026 Earnings",  date:"Apr 23, 2026",  eps_est:"$0.52", rev_est:"$22.1B",  iv_move:"±11%", score:78, free:true },
  { ticker:"MSFT",  report:"Q3 FY2026 Earnings",date:"Apr 30, 2026",  eps_est:"$3.22", rev_est:"$69.8B",  iv_move:"±5%",  score:82, free:true },
  { ticker:"AMZN",  report:"Q1 2026 Earnings",  date:"May 1, 2026",   eps_est:"$1.36", rev_est:"$155B",   iv_move:"±7%",  score:85, free:false },
  { ticker:"GOOG",  report:"Q1 2026 Earnings",  date:"Apr 29, 2026",  eps_est:"$2.01", rev_est:"$89.4B",  iv_move:"±6%",  score:80, free:false },
];

const IPOS = [
  { ticker:"XXXX",  name:"Stealth AI Startup",         date:"May 8, 2026",  price:"$14–16",  score:72, sector:"AI/ML",         free:true },
  { ticker:"YYYY",  name:"Biotech Phase 3 Co",          date:"May 15, 2026", price:"$10–12",  score:68, sector:"Biotech",       free:false },
  { ticker:"ZZZZ",  name:"Green Energy Infrastructure", date:"Jun 2, 2026",  price:"$18–20",  score:74, sector:"Clean Energy",  free:false },
];

function VerdictTag({ v }: { v: string }) {
  const color = v.startsWith("APPROVAL") || v === "POSITIVE" ? "var(--bull)" : v.includes("CRL") ? "var(--bear)" : "var(--neutral)";
  return <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, color, background: `${color}18`, border: `1px solid ${color}40` }}>{v}</span>;
}

function LockOverlay() {
  return (
    <div style={{ position: "absolute", inset: 0, backdropFilter: "blur(5px)", background: "rgba(8,12,20,0.6)", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <Lock size={14} style={{ color: "var(--accent)" }}/>
        <Link href="/pricing" style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>
          Upgrade <ArrowRight size={10}/>
        </Link>
      </div>
    </div>
  );
}

export default function CalendarsPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 72px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 8 }}>Event Calendars</div>
        <h1 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>FDA · Earnings · IPO Calendars</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>All upcoming high-impact market events, scored and ranked by AI conviction.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

        {/* FDA Calendar */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <FlaskConical size={18} style={{ color: "var(--accent)" }}/>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>FDA PDUFA & AdCom Calendar</h2>
          </div>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Ticker","Drug / Indication","Date","Event Type","AI Score","AI Verdict"].map(h => (
                      <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FDA_EVENTS.map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)", position: "relative" }}>
                      {!row.free && <td colSpan={6} style={{ padding: 0, position: "relative", height: 44 }}><LockOverlay/></td>}
                      {row.free && <>
                        <td style={{ padding: "10px 14px", fontFamily: "monospace", fontWeight: 700, color: "var(--accent)" }}>${row.ticker}</td>
                        <td style={{ padding: "10px 14px", color: "var(--text-secondary)", maxWidth: 260 }}>{row.drug}</td>
                        <td style={{ padding: "10px 14px", fontWeight: 600 }}>{row.date}</td>
                        <td style={{ padding: "10px 14px", color: "var(--text-muted)", fontSize: 12 }}>{row.type}</td>
                        <td style={{ padding: "10px 14px", fontFamily: "monospace", fontWeight: 700, color: row.score >= 80 ? "var(--bull)" : "var(--accent)" }}>{row.score}</td>
                        <td style={{ padding: "10px 14px" }}><VerdictTag v={row.verdict}/></td>
                      </>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Earnings Calendar */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <BarChart2 size={18} style={{ color: "var(--accent)" }}/>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Earnings Calendar</h2>
          </div>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Ticker","Report","Date","EPS Est.","Rev Est.","IV Move","AI Score"].map(h => (
                      <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {EARNINGS.map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)", position: "relative" }}>
                      {!row.free && (
                        <td colSpan={7} style={{ padding: 0, position: "relative", height: 44 }}><LockOverlay/></td>
                      )}
                      {row.free && <>
                        <td style={{ padding: "10px 14px", fontFamily: "monospace", fontWeight: 700, color: "var(--accent)" }}>${row.ticker}</td>
                        <td style={{ padding: "10px 14px", color: "var(--text-secondary)" }}>{row.report}</td>
                        <td style={{ padding: "10px 14px", fontWeight: 600 }}>{row.date}</td>
                        <td style={{ padding: "10px 14px", fontFamily: "monospace" }}>{row.eps_est}</td>
                        <td style={{ padding: "10px 14px", fontFamily: "monospace" }}>{row.rev_est}</td>
                        <td style={{ padding: "10px 14px", color: "var(--neutral)" }}>{row.iv_move}</td>
                        <td style={{ padding: "10px 14px", fontFamily: "monospace", fontWeight: 700, color: "var(--bull)" }}>{row.score}</td>
                      </>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* IPO Calendar */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Rocket size={18} style={{ color: "var(--accent)" }}/>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>IPO Calendar</h2>
          </div>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Ticker","Company","Expected Date","Price Range","Sector","AI Score"].map(h => (
                      <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {IPOS.map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)", position: "relative" }}>
                      {!row.free && (
                        <td colSpan={6} style={{ padding: 0, position: "relative", height: 44 }}><LockOverlay/></td>
                      )}
                      {row.free && <>
                        <td style={{ padding: "10px 14px", fontFamily: "monospace", fontWeight: 700, color: "var(--accent)" }}>{row.ticker}</td>
                        <td style={{ padding: "10px 14px", fontWeight: 500 }}>{row.name}</td>
                        <td style={{ padding: "10px 14px", fontWeight: 600 }}>{row.date}</td>
                        <td style={{ padding: "10px 14px", fontFamily: "monospace" }}>{row.price}</td>
                        <td style={{ padding: "10px 14px", color: "var(--text-secondary)" }}>{row.sector}</td>
                        <td style={{ padding: "10px 14px", fontFamily: "monospace", fontWeight: 700, color: "var(--accent)" }}>{row.score}</td>
                      </>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      <div style={{ marginTop: 36, textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 14 }}>Unlock all calendar events with an Alpha plan.</p>
        <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#fff", padding: "10px 22px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          <Calendar size={13}/> Upgrade to Alpha <ArrowRight size={13}/>
        </Link>
      </div>
    </div>
  );
}
