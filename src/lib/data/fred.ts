/**
 * Federal Reserve Economic Data (FRED) API — free, requires API key
 * Secret: FRED-API-KEY (from Azure Key Vault)
 * Key series for trading context: DFF, CPIAUCSL, UNRATE, T10Y2Y, VIXCLS, etc.
 */
import { getSecret } from "../azure-secrets";

const FRED_BASE = "https://api.stlouisfed.org/fred";

export interface FredObservation {
  date: string;
  value: number | null;
}

export interface FredSeries {
  id: string;
  title: string;
  units: string;
  frequency: string;
  latestValue: number | null;
  latestDate: string;
  observations: FredObservation[];
}

const KEY_SERIES: Record<string, string> = {
  DFF: "Federal Funds Rate",
  CPIAUCSL: "Consumer Price Index (CPI)",
  UNRATE: "Unemployment Rate",
  T10Y2Y: "10Y-2Y Treasury Spread",
  VIXCLS: "CBOE Volatility Index (VIX)",
  BAMLH0A0HYM2: "ICE BofA US High Yield Spread",
  DCOILWTICO: "Crude Oil (WTI) Price",
  DEXUSEU: "USD/EUR Exchange Rate",
};

async function getApiKey(): Promise<string> {
  return await getSecret("FRED-API-KEY");
}

/** Fetch a FRED series with the last N observations */
export async function getSeries(
  seriesId: string,
  limit = 30,
): Promise<FredSeries | null> {
  const apiKey = await getApiKey();
  if (!apiKey) {
    console.warn("[FRED] FRED-API-KEY not set — returning null");
    return null;
  }

  const infoUrl = `${FRED_BASE}/series?series_id=${seriesId}&api_key=${apiKey}&file_type=json`;
  const obsUrl = `${FRED_BASE}/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=${limit}`;

  try {
    const [infoRes, obsRes] = await Promise.all([
      fetch(infoUrl, { next: { revalidate: 3600 } }),
      fetch(obsUrl, { next: { revalidate: 3600 } }),
    ]);

    if (!infoRes.ok || !obsRes.ok) return null;

    const [infoData, obsData] = await Promise.all([infoRes.json(), obsRes.json()]);

    const info = infoData?.seriess?.[0];
    const obs: FredObservation[] = (obsData?.observations ?? [])
      .map((o: any) => ({ 
        date: o.date, 
        value: o.value === "." ? null : parseFloat(o.value) 
      }))
      .reverse();

    return {
      id: seriesId,
      title: info?.title ?? KEY_SERIES[seriesId] ?? seriesId,
      units: info?.units_short ?? "",
      frequency: info?.frequency_short ?? "",
      latestValue: obs.at(-1)?.value ?? null,
      latestDate: obs.at(-1)?.date ?? "",
      observations: obs,
    };
  } catch (err) {
    console.error("[FRED] fetch failed for", seriesId, err);
    return null;
  }
}

/** Fetch multiple key macro indicators at once */
export async function getMacroSnapshot(): Promise<Record<string, FredSeries | null>> {
  const ids = ["DFF", "CPIAUCSL", "UNRATE", "T10Y2Y", "VIXCLS"];
  const results = await Promise.all(ids.map(id => getSeries(id, 2).catch(() => null)));
  return Object.fromEntries(ids.map((id, i) => [id, results[i]]));
}
