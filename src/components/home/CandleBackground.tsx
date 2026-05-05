"use client";
import { useEffect, useRef } from "react";

interface Candle { open:number; high:number; low:number; close:number; }

function gen(prev:number): Candle {
  const open = prev;
  const close = open + (Math.random()-0.47)*2.8;
  const wick = Math.random()*2;
  return { open, close, high:Math.max(open,close)+wick+Math.random()*1.2, low:Math.min(open,close)-wick-Math.random()*0.8 };
}

export function CandleBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const CW=10, CG=3, CT=CW+CG, SP=0.35;
    let offset=0, animId:number;
    let candles: Candle[] = [];

    const resize = () => {
      canvas.width=canvas.offsetWidth; canvas.height=canvas.offsetHeight;
      const n=Math.ceil(canvas.width/CT)+8;
      while(candles.length<n) candles.push(gen(candles[candles.length-1]?.close??120));
    };

    const draw = () => {
      const W=canvas.width, H=canvas.height;
      ctx.clearRect(0,0,W,H);
      const vis=candles.slice(0,Math.ceil(W/CT)+2);
      let mn=Infinity,mx=-Infinity;
      vis.forEach(c=>{ if(c.low<mn)mn=c.low; if(c.high>mx)mx=c.high; });
      mn-=4; mx+=4;
      const rng=mx-mn||1;
      const toY=(p:number)=>H*0.12+(1-(p-mn)/rng)*H*0.76;

      ctx.strokeStyle="rgba(255,255,255,0.03)"; ctx.lineWidth=1;
      for(let i=0;i<=5;i++){ const y=H*0.12+(i/5)*H*0.76; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      candles.forEach((c,i)=>{
        const x=i*CT-offset;
        if(x+CW<-20||x>W+20) return;
        const green=c.close>=c.open;
        const fill=green?"rgba(0,230,118,0.65)":"rgba(255,61,87,0.65)";
        const stroke=green?"#00e676":"#ff3d57";
        const bT=toY(Math.max(c.open,c.close)), bB=toY(Math.min(c.open,c.close));
        const cx=x+CW/2, bH=Math.max(1.5,bB-bT);
        ctx.strokeStyle=stroke; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(cx,toY(c.high)); ctx.lineTo(cx,toY(c.low)); ctx.stroke();
        ctx.fillStyle=fill; ctx.fillRect(x,bT,CW,bH);
        ctx.strokeStyle=stroke; ctx.lineWidth=0.5; ctx.strokeRect(x,bT,CW,bH);
      });

      const gV=ctx.createLinearGradient(0,0,0,H);
      gV.addColorStop(0,"rgba(5,8,16,0.85)"); gV.addColorStop(0.1,"rgba(5,8,16,0)");
      gV.addColorStop(0.9,"rgba(5,8,16,0)"); gV.addColorStop(1,"rgba(5,8,16,0.85)");
      ctx.fillStyle=gV; ctx.fillRect(0,0,W,H);
      const gH=ctx.createLinearGradient(0,0,W,0);
      gH.addColorStop(0,"rgba(5,8,16,0.6)"); gH.addColorStop(0.08,"rgba(5,8,16,0)");
      gH.addColorStop(0.92,"rgba(5,8,16,0)"); gH.addColorStop(1,"rgba(5,8,16,0.9)");
      ctx.fillStyle=gH; ctx.fillRect(0,0,W,H);
      ctx.fillStyle="rgba(5,8,16,0.5)"; ctx.fillRect(0,0,W,H);
    };

    const tick=()=>{ offset+=SP; if(offset>=CT){ offset-=CT; candles.shift(); candles.push(gen(candles[candles.length-1].close)); } draw(); animId=requestAnimationFrame(tick); };
    const ro=new ResizeObserver(()=>{ resize(); draw(); }); ro.observe(canvas);
    resize(); animId=requestAnimationFrame(tick);
    return ()=>{ cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} style={{ position:"absolute", inset:0, width:"100%", height:"100%", display:"block" }} aria-hidden/>;
}
