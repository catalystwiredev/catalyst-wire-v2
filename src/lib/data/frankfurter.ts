import { tierAtLeast } from "../tier";

const BASE = "https://api.frankfurter.app";

export interface FXRate {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface FXHistoricalRate {
  date: string;
  rate: number;
}

export interface FXCurrency {
  code: string;
  name: string;
}

export async function getFXCurrencies(): Promise<FXCurrency[]> {
  try {
    const res = await fetch(`${BASE}/currencies`, { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data: Record<string, string> = await res.json();
    return Object.entries(data).map(([code, name]) => ({ code, name }));
  } catch (err) {
    console.error("[frankfurter] currencies failed:", err);
    return [];
  }
}

export async function getLatestRates(base = "USD", targets?: string[]): Promise<FXRate | null> {
  try {
    const params = new URLSearchParams({ from: base });
    if (targets?.length) params.set("to", targets.join(","));
    const res = await fetch(`${BASE}/latest?${params}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return await res.json() as FXRate;
  } catch (err) {
    console.error("[frankfurter] latest rates failed:", err);
    return null;
  }
}

export async function getCrossRate(from: string, to: string): Promise<number | null> {
  try {
    const res = await fetch(
      `${BASE}/latest?from=${from.toUpperCase()}&to=${to.toUpperCase()}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data: FXRate = await res.json();
    return data.rates[to.toUpperCase()] ?? null;
  } catch (err) {
    console.error("[frankfurter] cross rate failed:", from, to, err);
    return null;
  }
}

export async function getFXHistory(
  from: string,
  base = "USD",
  target = "EUR",
  to?: string,
): Promise<FXHistoricalRate[]> {
  try {
    const end = to ?? new Date().toISOString().slice(0, 10);
    const params = new URLSearchParams({ from: base, to: target });
    const res = await fetch(
      `${BASE}/${from}..${end}?${params}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data: { rates: Record<string, Record<string, number>> } = await res.json();
    return Object.entries(data.rates)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, rates]) => ({ date, rate: rates[target.toUpperCase()] ?? 0 }));
  } catch (err) {
    console.error("[frankfurter] history failed:", err);
    return [];
  }
}

export async function getMajorPairs(): Promise<FXRate | null> {
  return getLatestRates("USD", ["EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "CNY", "MXN", "BRL"]);
}
