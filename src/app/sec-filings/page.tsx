import { DataPreviewTable } from "@/components/shared/DataPreviewTable";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
const COLS=[{key:"form",label:"Form",width:"80px"},{key:"company",label:"Company",width:"120px"},{key:"summary",label:"Summary",width:"2fr"},{key:"score",label:"Score",width:"70px"},{key:"impact",label:"Impact",width:"90px"},{key:"filed",label:"Filed",width:"90px"}];
function Score({n}:{n:number}){const c=n>=80?"var(--bull)":n>=60?"var(--accent)":"var(--neutral)";return <span style={{fontFamily:"monospace",fontWeight:700,fontSize:13,color:c}}>{n}</span>}
function Form({f}:{f:string}){return <span style={{fontFamily:"monospace",fontSize:11,fontWeight:700,background:"var(--accent-dim)",color:"var(--accent)",border:"1px solid rgba(0,153,255,0.25)",borderRadius:5,padding:"1px 6px"}}>{f}</span>}
function Impact({l}:{l:string}){const m:any={HIGH:"pill-bull",MEDIUM:"pill-neutral",LOW:"pill-gray"};return <span className={`pill ${m[l]??'pill-neutral'}`}>{l}</span>}
const VISIBLE=[
  {id:"1",cells:{form:<Form f="8-K"/>,company:<span style={{fontFamily:"monospace",fontWeight:600}}>TSLA</span>,summary:"Material definitive agreement — $10B debt facility at 3.8% fixed rate",score:<Score n={82}/>,impact:<Impact l="HIGH"/>,filed:<span style={{fontSize:11,fontFamily:"monospace",color:"var(--text-secondary)"}}>08:47 ET</span>},expanded:<div><strong style={{color:"var(--text-primary)"}}>Filing analysis:</strong> Tesla secured $10B credit facility at 3.8% fixed, replacing variable-rate debt. Reduces interest expense ~$240M annually and extends maturity to 2032. AI verdict: Moderately bullish — improves balance sheet flexibility.<div style={{marginTop:8,display:"flex",gap:8}}><span className="pill pill-bull">Bullish</span><span className="pill pill-accent">Conviction: B</span></div></div>},
  {id:"2",cells:{form:<Form f="Form 4"/>,company:<span style={{fontFamily:"monospace",fontWeight:600}}>MSFT</span>,summary:"EVP Rajesh Jha purchases 42,000 shares — $19.8M insider acquisition",score:<Score n={89}/>,impact:<Impact l="HIGH"/>,filed:<span style={{fontSize:11,fontFamily:"monospace",color:"var(--text-secondary)"}}>08:22 ET</span>},expanded:null},
  {id:"3",cells:{form:<Form f="10-Q"/>,company:<span style={{fontFamily:"monospace",fontWeight:600}}>AMZN</span>,summary:"AWS segment margins expand to 38.1% from 34.2% — first quarterly beat in 3Q",score:<Score n={76}/>,impact:<Impact l="HIGH"/>,filed:<span style={{fontSize:11,fontFamily:"monospace",color:"var(--text-secondary)"}}>08:01 ET</span>},expanded:null},
  {id:"4",cells:{form:<Form f="S-1"/>,company:<span style={{fontFamily:"monospace",fontWeight:600}}>NURO</span>,summary:"IPO registration filed — AI robotics, seeking $800M at $4.2B valuation",score:<Score n={71}/>,impact:<Impact l="MEDIUM"/>,filed:<span style={{fontSize:11,fontFamily:"monospace",color:"var(--text-secondary)"}}>07:45 ET</span>},expanded:null},
];
const LOCKED=Array.from({length:7},(_,i)=>({id:`l${i}`,cells:{}}));
export default function Page(){return(
  <div style={{padding:"32px 24px",maxWidth:1200,margin:"0 auto"}}>
    <div style={{marginBottom:28,display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
      <div><div style={{fontSize:11,fontWeight:600,letterSpacing:"0.1em",color:"var(--accent)",textTransform:"uppercase",marginBottom:8}}>SEC EDGAR</div><h1 style={{fontSize:"clamp(22px,3vw,32px)",fontWeight:700,letterSpacing:"-0.02em",marginBottom:6}}>SEC Filings</h1><p style={{fontSize:14,color:"var(--text-secondary)"}}>8-K, Form 4, 10-Q, S-1 — AI-parsed within seconds of EDGAR publication.</p></div>
      <Link href="/register?plan=alpha" style={{display:"inline-flex",alignItems:"center",gap:7,background:"var(--accent)",color:"#fff",padding:"10px 20px",borderRadius:8,fontSize:13,fontWeight:600,textDecoration:"none"}}>Unlock all filings <ArrowRight size={14}/></Link>
    </div>
    <DataPreviewTable title="Latest SEC Filings" subtitle="Showing 4 of 89 filings processed today." cols={COLS} visible={VISIBLE} locked={LOCKED}/>
  </div>
);}
