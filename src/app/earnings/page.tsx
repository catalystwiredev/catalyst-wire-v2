import { DataPreviewTable } from "@/components/shared/DataPreviewTable";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
const COLS=[{key:"ticker",label:"Ticker",width:"80px"},{key:"when",label:"When",width:"70px"},{key:"eps",label:"EPS Est",width:"90px"},{key:"rev",label:"Rev Est",width:"100px"},{key:"iv",label:"IV Move",width:"80px"},{key:"score",label:"Score",width:"70px"},{key:"dir",label:"Direction",width:"100px"}];
function Score({n}:{n:number}){const c=n>=80?"var(--bull)":n>=60?"var(--accent)":"var(--neutral)";return <span style={{fontFamily:"monospace",fontWeight:700,color:c}}>{n}</span>}
function Dir({d}:{d:string}){const m:any={bullish:"pill-bull",bearish:"pill-bear",neutral:"pill-neutral"};return <span className={`pill ${m[d]??'pill-neutral'}`}>{d.toUpperCase()}</span>}
const VISIBLE=[
  {id:"1",cells:{ticker:<span style={{fontFamily:"monospace",fontWeight:700,color:"var(--accent)"}}>NVDA</span>,when:<span style={{fontSize:11,fontWeight:600,color:"var(--bull)"}}>BMO</span>,eps:<span style={{fontFamily:"monospace"}}>$4.28</span>,rev:<span style={{fontFamily:"monospace"}}>$28.2B</span>,iv:<span style={{fontFamily:"monospace",color:"var(--bull)"}}>±9.4%</span>,score:<Score n={94}/>,dir:<Dir d="bullish"/>},expanded:<div><strong style={{color:"var(--text-primary)"}}>Pre-earnings AI:</strong> NVDA has beaten EPS in 11 of last 12 quarters. Average upside surprise: +18.3%. Options pricing ±9.4% move. Historical post-earnings avg on beats: +7.8%. Conviction: A.<div style={{marginTop:8,display:"flex",gap:8}}><span className="pill pill-bull">Strong setup</span><span className="pill pill-accent">High IV</span></div></div>},
  {id:"2",cells:{ticker:<span style={{fontFamily:"monospace",fontWeight:700,color:"var(--accent)"}}>AAPL</span>,when:<span style={{fontSize:11,fontWeight:600,color:"var(--neutral)"}}>AMC</span>,eps:<span style={{fontFamily:"monospace"}}>$1.52</span>,rev:<span style={{fontFamily:"monospace"}}>$91.4B</span>,iv:<span style={{fontFamily:"monospace",color:"var(--neutral)"}}>±4.1%</span>,score:<Score n={82}/>,dir:<Dir d="bullish"/>},expanded:null},
  {id:"3",cells:{ticker:<span style={{fontFamily:"monospace",fontWeight:700,color:"var(--accent)"}}>GOOGL</span>,when:<span style={{fontSize:11,fontWeight:600,color:"var(--neutral)"}}>AMC</span>,eps:<span style={{fontFamily:"monospace"}}>$1.87</span>,rev:<span style={{fontFamily:"monospace"}}>$86.3B</span>,iv:<span style={{fontFamily:"monospace",color:"var(--neutral)"}}>±5.8%</span>,score:<Score n={74}/>,dir:<Dir d="neutral"/>},expanded:null},
  {id:"4",cells:{ticker:<span style={{fontFamily:"monospace",fontWeight:700,color:"var(--accent)"}}>META</span>,when:<span style={{fontSize:11,fontWeight:600,color:"var(--neutral)"}}>AMC</span>,eps:<span style={{fontFamily:"monospace"}}>$5.25</span>,rev:<span style={{fontFamily:"monospace"}}>$39.9B</span>,iv:<span style={{fontFamily:"monospace",color:"var(--neutral)"}}>±6.2%</span>,score:<Score n={88}/>,dir:<Dir d="bullish"/>},expanded:null},
];
const LOCKED=Array.from({length:8},(_,i)=>({id:`l${i}`,cells:{}}));
export default function Page(){return(
  <div style={{padding:"32px 24px",maxWidth:1200,margin:"0 auto"}}>
    <div style={{marginBottom:28,display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
      <div><div style={{fontSize:11,fontWeight:600,letterSpacing:"0.1em",color:"var(--accent)",textTransform:"uppercase",marginBottom:8}}>Earnings Calendar</div><h1 style={{fontSize:"clamp(22px,3vw,32px)",fontWeight:700,letterSpacing:"-0.02em",marginBottom:6}}>Earnings Intelligence</h1><p style={{fontSize:14,color:"var(--text-secondary)"}}>Pre-earnings AI analysis, historical surprise patterns, and options implied moves.</p></div>
      <Link href="/register?plan=alpha" style={{display:"inline-flex",alignItems:"center",gap:7,background:"var(--accent)",color:"#fff",padding:"10px 20px",borderRadius:8,fontSize:13,fontWeight:600,textDecoration:"none"}}>Unlock full calendar <ArrowRight size={14}/></Link>
    </div>
    <DataPreviewTable title="This Week's Earnings" subtitle="Showing 4 of 236 reports." cols={COLS} visible={VISIBLE} locked={LOCKED}/>
  </div>
);}
