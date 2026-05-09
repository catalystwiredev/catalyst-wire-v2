/**
 * Frankfurter API — real-time and historical forex rates from the European Central Bank.
 * No API key required. Updates daily on ECB business days (~16:00 CET).
 * Weekend rates: last available Friday close.
 *
 * Docs: https://www.frankfurter.app/docs
 */

const BASE = "https://api.frankfurter.app";

export interface FXRate {
  base:   string;
  date:   string;
  rates:  Record<string, number>;
}

export interface FXHistoricalRate {
  date:   string;
  rate:   number;
}

export interface FXCurrency {
  code: string;
  name: string;
}

/** All available currency codes with full names. */
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

/**
 * Latest rates for a base currency.
 * @param base    Source currency (default "USD")
 * @param targets Array of target currencies — omit for all ~32 ECB currencies
 */
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

/**
 * Single cross rate between two currencies at latest ECB fix.
 * Returns null if either currency is unsupported.
 */
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

/**
 * Historical daily closing rates for a currency pair over a date range.
 * Returns array ordered oldest → newest.
 *
 * @param from     Start date "YYYY-MM-DD"
 * @param to       End date   "YYYY-MM-DD" (default today)
 * @param base     Base currency (default "USD")
 * @param target   Target currency (e.g. "EUR")
 */
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

/** Common major pairs snapshot — USD base vs EUR, GBP, JPY, CHF, CAD, AUD, CNY. */
export async function getMajorPairs(): Promise<FXRate | null> {
  return getLatestRates("USD", ["EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "CNY", "MXN", "BRL"]);
}
