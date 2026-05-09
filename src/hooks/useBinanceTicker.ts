"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface BinanceTickerUpdate {
  symbol:             string;
  lastPrice:          number;
  priceChange:        number;
  priceChangePercent: number;
  highPrice:          number;
  lowPrice:           number;
  volume:             number;
  quoteVolume:        number;
}

interface BinanceWSMessage {
  s: string;   // symbol
  c: string;   // close (last price)
  P: string;   // price change percent
  p: string;   // price change
  h: string;   // high
  l: string;   // low
  v: string;   // base volume
  q: string;   // quote volume
}

type Status = "connecting" | "open" | "closed" | "error";

/**
 * Subscribes to one or more Binance public WebSocket ticker streams.
 * No API key required — Binance public streams are unauthenticated.
 *
 * @param symbols  Binance symbols to stream (e.g. ["BTCUSDT", "ETHUSDT"])
 *
 * @example
 * const { tickers, status } = useBinanceTicker(["BTCUSDT", "ETHUSDT"]);
 */
export function useBinanceTicker(symbols: string[]) {
  const [tickers, setTickers] = useState<Record<string, BinanceTickerUpdate>>({});
  const [status, setStatus] = useState<Status>("closed");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    if (!symbols.length) return;

    const streams = symbols
      .map(s => `${s.toLowerCase()}@ticker`)
      .join("/");

    const url = symbols.length === 1
      ? `wss://stream.binance.com:9443/ws/${symbols[0].toLowerCase()}@ticker`
      : `wss://stream.binance.com:9443/stream?streams=${streams}`;

    const ws = new WebSocket(url);
    wsRef.current = ws;
    setStatus("connecting");

    ws.onopen = () => setStatus("open");

    ws.onmessage = (event: MessageEvent) => {
      const raw = JSON.parse(event.data as string);
      // Combined stream wraps payload in { stream, data }; single stream sends payload directly.
      const d: BinanceWSMessage = raw.data ?? raw;
      setTickers(prev => ({
        ...prev,
        [d.s]: {
          symbol:             d.s,
          lastPrice:          parseFloat(d.c),
          priceChange:        parseFloat(d.p),
          priceChangePercent: parseFloat(d.P),
          highPrice:          parseFloat(d.h),
          lowPrice:           parseFloat(d.l),
          volume:             parseFloat(d.v),
          quoteVolume:        parseFloat(d.q),
        },
      }));
    };

    ws.onerror = () => setStatus("error");

    ws.onclose = () => {
      setStatus("closed");
      // Auto-reconnect after 3 seconds on unexpected close.
      reconnectTimer.current = setTimeout(connect, 3000);
    };
  }, [symbols.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return { tickers, status };
}
