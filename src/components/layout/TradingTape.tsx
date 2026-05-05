"use client";
import { useEffect, useRef } from "react";

export function TradingTape() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    s.async = true;
    s.innerHTML = JSON.stringify({
      symbols: [
        {proName:"FOREXCOM:SPXUSD",title:"S&P 500"},
        {proName:"FOREXCOM:NSXUSD",title:"Nasdaq 100"},
        {proName:"COINBASE:BTCUSD",title:"BTC/USD"},
        {proName:"COINBASE:ETHUSD",title:"ETH/USD"},
        {proName:"NASDAQ:NVDA",title:"NVDA"},
        {proName:"NASDAQ:AAPL",title:"AAPL"},
        {proName:"NASDAQ:TSLA",title:"TSLA"},
        {proName:"NASDAQ:META",title:"META"},
        {proName:"NASDAQ:MSFT",title:"MSFT"},
        {proName:"TVC:GOLD",title:"Gold"},
        {proName:"TVC:USOIL",title:"Crude Oil"},
        {proName:"FX:EURUSD",title:"EUR/USD"},
      ],
      showSymbolLogo: true, isTransparent: true,
      displayMode: "adaptive", colorTheme: "dark", locale: "en",
    });
    ref.current.appendChild(s);
    return () => { if (ref.current) ref.current.innerHTML = ""; };
  }, []);
  return (
    <div className="tradingview-widget-container" ref={ref} style={{ height:"var(--tape-h)", overflow:"hidden" }}>
      <div className="tradingview-widget-container__widget" />
    </div>
  );
}
