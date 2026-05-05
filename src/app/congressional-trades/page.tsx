import { DataPreviewTable } from "@/components/shared/DataPreviewTable";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
const COLS=[{key:"member",label:"Member",width:"160px"},{key:"party",label:"Party",width:"60px"},{key:"ticker",label:"Ticker",width:"80px"},{key:"trade",label:"Trade",width:"70px"},{key:"amount",label:"Amount",width:"120px"},{key:"disclosed",label:"Disclosed",width:"90px"},{key:"score",label:"Signal",width:"70px"}];
function Score({n}:{n:number}){const c=n>=80?"var(--bull)":n>=60?"var(--accent)":"var(--neutral)";return <span style={{fontFamily:"monospace",fontWeight:700,color:c}}>{n}</span>}
function Party({p}:{p:string}){const c:any={R:"#ef4444",D:"#3b82f6",I:"#a78bfa"};return <span style={{fontSize:11,fontWeight:700,color:c[p],background:`${c[p]}18`,border:`1px solid ${c[p]}30`,borderRadius:5,padding:"1px 6px"}}>{p}</span>}
const VISIBLE=[
  {id:"1",cells:{member:<span style={{fontSize:12}}>Rep. M. Pelosi</span>,party:<Party p="D"/>,ticker:<span style={{fontFamily:"monospace",fontWeight:700,color:"var(--accent)"}}>NVDA</span>,trade:<span className="pill pill-bull">BUY</span>,amount:<span style={{fontFamily:"monospace"}}>$250K–$500K</span>,disclosed:<span style={{fontSize:11,color:"var(--bear)"}}>3d late</span>,score:<Score n={92}/>},expanded:<div><strong style={{color:"var(--text-primary)"}}>Congressional signal:</strong> Semiconductor sector subject of multiple active committee hearings on AI export controls. Historical: Pelosi semiconductor buys 6-month avg return +23.1%. Conviction: A.<div style={{marginTop:8,display:"flex",gap:8}}><span className="pill pill-bull">High conviction</span><span className="pill pill-gold">Committee access</span></div></div>},
  {id:"2",cells:{member:<span style={{fontSize:12}}>Sen. T. Tuberville</span>,party:<Party p="R"/>,ticker:<span style={{fontFamily:"monospace",fontWeight:700,color:"var(--accent)"}}>LMT</span>,trade:<span className="pill pill-bull">BUY</span>,amount:<span style={{fontFamily:"monospace"}}>$100K–$250K</span>,disclosed:<span style={{fontSize:11,color:"var(--neutral)"}}>1d</span>,score:<Score n={85}/>},expanded:null},
  {id:"3",cells:{member:<span style={{fontSize:12}}>Rep. B. Carson</span>,party:<Party p="D"/>,ticker:<span style={{fontFamily:"monospace",fontWeight:700,color:"var(--accent)"}}>UNH</span>,trade:<span className="pill pill-bear">SELL</span>,amount:<span style={{fontFamily:"monospace"}}>$50K–$100K</span>,disclosed:<span style={{fontSize:11,color:"var(--bull)"}}>Same day</span>,score:<Score n={61}/>},expanded:null},
  {id:"4",cells:{member:<span style={{fontSize:12}}>Sen. J. Ossoff</span>,party:<Party p="D"/>,ticker:<span style={{fontFamily:"monospace",fontWeight:700,color:"var(--accent)"}}>MSFT</span>,trade:<span className="pill pill-bull">BUY</span>,amount:<span style={{fontFamily:"monospace"}}>$15K–$50K</span>,disclosed:<span style={{fontSize:11,color:"var(--bull)"}}>2d</span>,score:<Score n={78}/>},expanded:null},
];
const LOCKED=Array.from({length:8},(_,i)=>({id:`l${i}`,cells:{}}));
export default function Page(){return(
  <div style={{padding:"32px 24px",maxWidth:1200,margin:"0 auto"}}>
    <div style={{marginBottom:28,display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
      <div><div style={{fontSize:11,fontWeight:600,letterSpacing:"0.1em",color:"var(--gold)",textTransform:"uppercase",marginBottom:8}}>STOCK Act · Political Alpha</div><h1 style={{fontSize:"clamp(22px,3vw,32px)",fontWeight:700,letterSpacing:"-0.02em",marginBottom:6}}>Congressional Trades</h1><p style={{fontSize:14,color:"var(--text-secondary)"}}>STOCK Act disclosures — who's trading before it's in the news.</p></div>
      <Link href="/register?plan=alpha" style={{display:"inline-flex",alignItems:"center",gap:7,background:"var(--accent)",color:"#fff",padding:"10px 20px",borderRadius:8,fontSize:13,fontWeight:600,textDecoration:"none"}}>Unlock full database <ArrowRight size={14}/></Link>
    </div>
    <DataPreviewTable title="Recent Congressional Disclosures" subtitle="Showing 4 of 12 disclosures this week." cols={COLS} visible={VISIBLE} locked={LOCKED}/>
  </div>
);}
