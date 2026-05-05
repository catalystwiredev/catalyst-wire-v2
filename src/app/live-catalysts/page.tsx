import { DataPreviewTable } from "@/components/shared/DataPreviewTable";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const COLS = [
  {key:"ticker",label:"Ticker",width:"80px"},
  {key:"score",label:"Score",width:"70px"},
  {key:"signal",label:"Catalyst",width:"2fr"},
  {key:"direction",label:"Direction",width:"100px"},
  {key:"source",label:"Source",width:"110px"},
  {key:"time",label:"Time",width:"80px"},
];
function Score({n}:{n:number}){const c=n>=80?"var(--bull)":n>=60?"var(--accent)":"var(--neutral)";return <span style={{fontFamily:"monospace",fontWeight:700,fontSize:13,color:c,background:`${c}15`,border:`1px solid ${c}40`,borderRadius:6,padding:"1px 7px"}}>{n}</span>}
function Dir({d}:{d:string}){const m:any={bullish:"pill-bull",bearish:"pill-bear",neutral:"pill-neutral"};return <span className={`pill ${m[d]??'pill-neutral'}`}>{d.toUpperCase()}</span>}
const VISIBLE=[
  {id:"1",cells:{ticker:<span style={{fontFamily:"monospace",fontWeight:700,color:"var(--accent)"}}>NVDA</span>,score:<Score n={94}/>,signal:"Earnings beat: EPS $5.16 vs $4.28 est, revenue +78% YoY",direction:<Dir d="bullish"/>,source:<span style={{fontSize:11,color:"var(--text-muted)"}}>8-K / Earnings</span>,time:<span style={{fontFamily:"monospace",fontSize:11}}>08:42 ET</span>},expanded:<div><strong style={{color:"var(--text-primary)"}}>AI Analysis:</strong> NVDA reported Q3 EPS of $5.16 vs consensus $4.28 — a +20.5% beat. Revenue of $35.1B exceeded estimates by $2.3B driven by data center demand. Conviction tier: A. Historical pattern: NVDA has moved +8–14% on beats of this magnitude in the past 4 occurrences.<div style={{marginTop:8,display:"flex",gap:8,flexWrap:"wrap"}}><span className="pill pill-bull">Conviction: A</span><span className="pill pill-accent">Data Center</span></div></div>},
  {id:"2",cells:{ticker:<span style={{fontFamily:"monospace",fontWeight:700,color:"var(--accent)"}}>MRNA</span>,score:<Score n={91}/>,signal:"FDA grants full approval for mRNA-4157 melanoma adjuvant therapy",direction:<Dir d="bullish"/>,source:<span style={{fontSize:11,color:"var(--text-muted)"}}>OpenFDA</span>,time:<span style={{fontFamily:"monospace",fontSize:11}}>08:15 ET</span>},expanded:<div><strong style={{color:"var(--text-primary)"}}>AI Analysis:</strong> Full FDA approval for mRNA-4157 in combination with pembrolizumab for high-risk melanoma. First-in-class personalized oncology approval. TAM estimate: $8-12B by 2030. Conviction tier: A.<div style={{marginTop:8,display:"flex",gap:8}}><span className="pill pill-bull">Conviction: A</span><span className="pill pill-accent">Biotech</span></div></div>},
  {id:"3",cells:{ticker:<span style={{fontFamily:"monospace",fontWeight:700,color:"var(--accent)"}}>AAPL</span>,score:<Score n={87}/>,signal:"CEO Tim Cook purchases 150,000 shares — $31.2M insider buy",direction:<Dir d="bullish"/>,source:<span style={{fontSize:11,color:"var(--text-muted)"}}>Form 4</span>,time:<span style={{fontFamily:"monospace",fontSize:11}}>08:31 ET</span>},expanded:null},
  {id:"4",cells:{ticker:<span style={{fontFamily:"monospace",fontWeight:700,color:"var(--accent)"}}>META</span>,score:<Score n={78}/>,signal:"Q3 revenue guidance raised to $46.5-49.5B vs $44.2B consensus",direction:<Dir d="bullish"/>,source:<span style={{fontSize:11,color:"var(--text-muted)"}}>8-K</span>,time:<span style={{fontFamily:"monospace",fontSize:11}}>07:59 ET</span>},expanded:null},
];
const LOCKED=Array.from({length:6},(_,i)=>({id:`l${i}`,cells:{}}));

export default function Page(){return(
  <div style={{padding:"32px 24px",maxWidth:1200,margin:"0 auto"}}>
    <div style={{marginBottom:28,display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
      <div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span className="live-dot"/><span style={{fontSize:11,fontWeight:600,letterSpacing:"0.1em",color:"var(--accent)",textTransform:"uppercase"}}>Live Feed</span></div>
        <h1 style={{fontSize:"clamp(22px,3vw,32px)",fontWeight:700,letterSpacing:"-0.02em",marginBottom:6}}>Live Catalysts</h1>
        <p style={{fontSize:14,color:"var(--text-secondary)"}}>AI-scored market catalysts ranked by conviction. Updated in real time across all sessions.</p>
      </div>
      <Link href="/register?plan=alpha" style={{display:"inline-flex",alignItems:"center",gap:7,background:"var(--accent)",color:"#fff",padding:"10px 20px",borderRadius:8,fontSize:13,fontWeight:600,textDecoration:"none"}}>Unlock real-time feed <ArrowRight size={14}/></Link>
    </div>
    <DataPreviewTable title="Today's Scored Catalysts" subtitle="Showing 4 of 128 signals scored today. Upgrade to see all." cols={COLS} visible={VISIBLE} locked={LOCKED}/>
  </div>
);}
