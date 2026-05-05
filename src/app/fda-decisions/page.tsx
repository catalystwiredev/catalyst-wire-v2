import { DataPreviewTable } from "@/components/shared/DataPreviewTable";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
const COLS=[{key:"company",label:"Company",width:"100px"},{key:"drug",label:"Drug",width:"130px"},{key:"indication",label:"Indication",width:"160px"},{key:"pdufa",label:"PDUFA Date",width:"120px"},{key:"score",label:"AI Score",width:"80px"},{key:"verdict",label:"Expected",width:"110px"}];
function Score({n}:{n:number}){const c=n>=80?"var(--bull)":n>=60?"var(--accent)":"var(--neutral)";return <span style={{fontFamily:"monospace",fontWeight:700,fontSize:13,color:c,background:`${c}15`,border:`1px solid ${c}40`,borderRadius:6,padding:"1px 7px"}}>{n}</span>}
function Verdict({v}:{v:string}){const m:any={APPROVAL:"pill-bull",CRL:"pill-bear",DELAY:"pill-neutral",UNKNOWN:"pill-accent"};return <span className={`pill ${m[v]??'pill-neutral'}`}>{v}</span>}
const VISIBLE=[
  {id:"1",cells:{company:<span style={{fontFamily:"monospace",fontWeight:600,color:"var(--accent)"}}>MRNA</span>,drug:<span style={{fontSize:12}}>mRNA-4157</span>,indication:<span style={{fontSize:12}}>Stage III/IV Melanoma</span>,pdufa:<span style={{fontFamily:"monospace",fontSize:12,color:"var(--bull)"}}>Mar 15, 2025</span>,score:<Score n={91}/>,verdict:<Verdict v="APPROVAL"/>},expanded:<div><strong style={{color:"var(--text-primary)"}}>FDA catalyst AI:</strong> Phase 3 KEYNOTE-942 demonstrated statistically significant RFS improvement. FDA Breakthrough Therapy designation. Advisory committee unanimously favorable. Historical: BT + positive AdCom = 94% approval rate. Conviction: A.<div style={{marginTop:8,display:"flex",gap:8}}><span className="pill pill-bull">Breakthrough Therapy</span><span className="pill pill-bull">AdCom: 14-0</span></div></div>},
  {id:"2",cells:{company:<span style={{fontFamily:"monospace",fontWeight:600,color:"var(--accent)"}}>BIIB</span>,drug:<span style={{fontSize:12}}>Lecanemab</span>,indication:<span style={{fontSize:12}}>Early Alzheimer's</span>,pdufa:<span style={{fontFamily:"monospace",fontSize:12,color:"var(--bull)"}}>Mar 22, 2025</span>,score:<Score n={78}/>,verdict:<Verdict v="APPROVAL"/>},expanded:null},
  {id:"3",cells:{company:<span style={{fontFamily:"monospace",fontWeight:600,color:"var(--accent)"}}>SGEN</span>,drug:<span style={{fontSize:12}}>Enfortumab</span>,indication:<span style={{fontSize:12}}>Urothelial Cancer</span>,pdufa:<span style={{fontFamily:"monospace",fontSize:12,color:"var(--neutral)"}}>Apr 3, 2025</span>,score:<Score n={65}/>,verdict:<Verdict v="DELAY"/>},expanded:null},
  {id:"4",cells:{company:<span style={{fontFamily:"monospace",fontWeight:600,color:"var(--accent)"}}>RXMD</span>,drug:<span style={{fontSize:12}}>RX-7842</span>,indication:<span style={{fontSize:12}}>NASH / Liver Disease</span>,pdufa:<span style={{fontFamily:"monospace",fontSize:12,color:"var(--bear)"}}>Apr 18, 2025</span>,score:<Score n={44}/>,verdict:<Verdict v="CRL"/>},expanded:null},
];
const LOCKED=Array.from({length:6},(_,i)=>({id:`l${i}`,cells:{}}));
export default function Page(){return(
  <div style={{padding:"32px 24px",maxWidth:1200,margin:"0 auto"}}>
    <div style={{marginBottom:28,display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
      <div><div style={{fontSize:11,fontWeight:600,letterSpacing:"0.1em",color:"#f472b6",textTransform:"uppercase",marginBottom:8}}>OpenFDA · Biotech</div><h1 style={{fontSize:"clamp(22px,3vw,32px)",fontWeight:700,letterSpacing:"-0.02em",marginBottom:6}}>FDA Decisions</h1><p style={{fontSize:14,color:"var(--text-secondary)"}}>PDUFA dates, drug approvals, clinical trial outcomes — AI probability scores.</p></div>
      <Link href="/register?plan=alpha" style={{display:"inline-flex",alignItems:"center",gap:7,background:"var(--accent)",color:"#fff",padding:"10px 20px",borderRadius:8,fontSize:13,fontWeight:600,textDecoration:"none"}}>Unlock PDUFA calendar <ArrowRight size={14}/></Link>
    </div>
    <DataPreviewTable title="Upcoming FDA Decisions" subtitle="Showing 4 of 24 upcoming decisions." cols={COLS} visible={VISIBLE} locked={LOCKED}/>
  </div>
);}
