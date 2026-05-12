"use client";
import { useEffect, useRef } from "react";
import { createChart, ColorType, CandlestickSeries, LineSeries, type IChartApi, type ISeriesApi, type Time, type UTCTimestamp } from "lightweight-charts";
import { TrendingUp, TrendingDown, Wifi, WifiOff, AlertTriangle, Lock } from "lucide-react";
import { useSignalStream } from "@/lib/pubsub-client";
import type { Bar } from "@/lib/data/alpaca";
import type { Signal } from "@/lib/azure-db";
import { tierAtLeast } from "@/lib/tier";

interface Props {
  symbol: string;
  initialBars: Bar[];
  initialSignal: Signal | null;
  isPremium: boolean;
}

function toUtcTimestamp(iso: string): UTCTimestamp {
  return Math.floor(new Date(iso).getTime() / 1000) as UTCTimestamp;
}

export function ChartClient({ symbol, initialBars, initialSignal, isPremium }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const meanRef = useRef<ISeriesApi<"Line"> | null>(null);
  const bullRef = useRef<ISeriesApi<"Line"> | null>(null);
  const bearRef = useRef<ISeriesApi<"Line"> | null>(null);

  const { status, signals: liveSignals } = useSignalStream(20, symbol);

  // Latest signal (live overrides initial)
  const latestSignal = liveSignals[0] ?? initialSignal ?? null;

  // Initialize chart
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 500,
      layout: {
        background: { type: ColorType.Solid, color: "rgba(8,14,26,0)" },
        textColor: "#a8b3c7",
        fontFamily: "ui-monospace, monospace",
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.04)" },
        horzLines: { color: "rgba(255,255,255,0.04)" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: "rgba(255,255,255,0.07)",
      },
      rightPriceScale: { borderColor: "rgba(255,255,255,0.07)" },
      crosshair: { mode: 0 },
    });

    const candle = chart.addSeries(CandlestickSeries, {
      upColor: "#00e676",
      downColor: "#ff4d4d",
      wickUpColor: "#00e676",
      wickDownColor: "#ff4d4d",
      borderVisible: false,
    });

    const meanLine = chart.addSeries(LineSeries, { color: "#a78bfa", lineWidth: 2, title: "AI Mean Target" });
    const bullLine = chart.addSeries(LineSeries, { color: "rgba(0,230,118,0.55)", lineWidth: 1, lineStyle: 2, title: "Bull Range (q90)" });
    const bearLine = chart.addSeries(LineSeries, { color: "rgba(255,77,77,0.55)", lineWidth: 1, lineStyle: 2, title: "Bear Range (q10)" });

    chartRef.current = chart;
    candleRef.current = candle;
    meanRef.current = meanLine;
    bullRef.current = bullLine;
    bearRef.current = bearLine;

    // Load initial bars
    candle.setData(initialBars.map(b => ({
      time: toUtcTimestamp(b.t),
      open: b.o,
      high: b.h,
      low: b.l,
      close: b.c,
    })));

    const ro = new ResizeObserver(() => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
      }
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = candleRef.current = meanRef.current = bullRef.current = bearRef.current = null;
    };
  }, [initialBars]);

  // Draw AI prediction lines from latest signal
  useEffect(() => {
    if (!latestSignal || !meanRef.current || !bullRef.current || !bearRef.current) return;

    const lastBar = initialBars[initialBars.length - 1];
    if (!lastBar) return;

    const startTs = toUtcTimestamp(lastBar.t);
    const stepSec = 60;
    const steps = latestSignal.steps || 5;

    const meanData: { time: Time; value: number }[] = [];
    const bullData: { time: Time; value: number }[] = [];
    const bearData: { time: Time; value: number }[] = [];

    for (let i = 0; i <= steps; i++) {
      const t = (startTs + i * stepSec) as UTCTimestamp;
      meanData.push({ time: t, value: i === 0 ? lastBar.c : latestSignal.mean_target });
      bullData.push({ time: t, value: i === 0 ? lastBar.c : latestSignal.bull_range });
      bearData.push({ time: t, value: i === 0 ? lastBar.c : latestSignal.bear_range });
    }

    meanRef.current.setData(meanData);
    bullRef.current.setData(bullData);
    bearRef.current.setData(bearData);
  }, [latestSignal, initialBars]);

  const dirColor = latestSignal?.direction === "UP" ? "#00e676" : "#ff4d4d";
  const DirIcon = latestSignal?.direction === "UP" ? TrendingUp : TrendingDown;
  const StatusIcon = status === "connected" ? Wifi : status === "error" ? AlertTriangle : WifiOff;
  const statusColor = status === "connected" ? "#00e676" : status === "error" ? "#ff4d4d" : "#6a84a0";
  const statusText = status === "connected" ? "LIVE" : status === "connecting" ? "CONNECTING..." : status === "error" ? "ERROR" : "OFFLINE";

  return (
    <div style={{ background: "rgba(8,14,26,0.70)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 32px rgba(0,0,0,0.4)" }}>
      {/* Status Bar */}
      <div style={{ padding: "14px 20px", background: "rgba(4,8,18,0.60)", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 16 }}>{symbol}</span>
          {latestSignal && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: dirColor, background: `${dirColor}12`, border: `1px solid ${dirColor}28`, borderRadius: 6, padding: "4px 10px" }}>
              <DirIcon size={12} /> {latestSignal.direction} · {latestSignal.confidence}% · {latestSignal.pct_change >= 0 ? "+" : ""}{latestSignal.pct_change.toFixed(2)}%
            </span>
          )}
        </div>

        {isPremium ? (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: statusColor, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", background: `${statusColor}10`, border: `1px solid ${statusColor}25`, borderRadius: 6, padding: "4px 9px" }}>
            <StatusIcon size={11} /> {statusText}
          </div>
        ) : (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "#6a84a0", fontWeight: 600 }}>
            <Lock size={11} /> Live signals — Alpha tier required
          </div>
        )}
      </div>

      {/* Chart Container */}
      <div ref={containerRef} style={{ width: "100%", height: 500, position: "relative" }}>
        {initialBars.length === 0 && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 13 }}>
            No bar data available for {symbol}
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: 18, flexWrap: "wrap", fontSize: 11, color: "var(--text-muted)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 12, height: 2, background: "#a78bfa" }} /> AI Mean Target</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 12, height: 2, background: "rgba(0,230,118,0.55)", borderTop: "1px dashed rgba(0,230,118,0.8)" }} /> Bull Range (q90)</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 12, height: 2, background: "rgba(255,77,77,0.55)", borderTop: "1px dashed rgba(255,77,77,0.8)" }} /> Bear Range (q10)</span>
      </div>
    </div>
  );
}
