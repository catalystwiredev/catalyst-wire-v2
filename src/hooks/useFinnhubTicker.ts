"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface FinnhubTrade {
  symbol:    string;
  price:     number;
  volume:    number;
  timestamp: number;   // Unix ms
  conditions: string[];
}

type Status = "connecting" | "open" | "closed" | "error";

/**
 * Subscribes to Finnhub's free real-time trade WebSocket.
 * Supports stocks, forex (e.g. "OANDA:EUR_USD"), and crypto (e.g. "BINANCE:BTCUSDT").
 * Includes pre-market and after-hours trades — check `conditions` for session flags.
 *
 * Requires NEXT_PUBLIC_FINNHUB_API_KEY to be set (exposed to the browser intentionally
 * for WebSocket use; Finnhub free keys are low-risk to expose).
 *
 * @param symbols  Finnhub symbols to subscribe to
 *
 * @example
 * const { trades, lastPrices, status } = useFinnhubTicker(["AAPL", "BINANCE:BTCUSDT"]);
 */
export function useFinnhubTicker(symbols: string[]) {
  const [trades, setTrades] = useState<FinnhubTrade[]>([]);
  const [lastPrices, setLastPrices] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<Status>("closed");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!apiKey || !symbols.length) return;

    const ws = new WebSocket(`wss://ws.finnhub.io?token=${apiKey}`);
    wsRef.current = ws;
    setStatus("connecting");

    ws.onopen = () => {
      setStatus("open");
      symbols.forEach(sym => {
        ws.send(JSON.stringify({ type: "subscribe", symbol: sym }));
      });
    };

    ws.onmessage = (event: MessageEvent) => {
      const msg = JSON.parse(event.data as string);
      if (msg.type !== "trade" || !msg.data?.length) return;

      const incoming: FinnhubTrade[] = (msg.data as Array<{
        s: string; p: number; v: number; t: number; c?: string[];
      }>).map(t => ({
        symbol:     t.s,
        price:      t.p,
        volume:     t.v,
        timestamp:  t.t,
        conditions: t.c ?? [],
      }));

      setTrades(prev => [...incoming, ...prev].slice(0, 200));
      setLastPrices(prev => {
        const next = { ...prev };
        incoming.forEach(t => { next[t.symbol] = t.price; });
        return next;
      });
    };

    ws.onerror = () => setStatus("error");

    ws.onclose = () => {
      setStatus("closed");
      reconnectTimer.current = setTimeout(connect, 5000);
    };
  }, [symbols.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (wsRef.current) {
        symbols.forEach(sym => {
          wsRef.current?.send(JSON.stringify({ type: "unsubscribe", symbol: sym }));
        });
        wsRef.current.close();
      }
    };
  }, [connect]);

  return { trades, lastPrices, status };
}
