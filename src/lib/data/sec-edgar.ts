/**
 * SEC EDGAR Full-Text Search API (free, no auth required)
 * Docs: https://efts.sec.gov/LATEST/search-index?q=...
 *
 * UTPB / academic: also leverage WRDS CRSP/Compustat for deeper filing data.
 * Set WRDS_USERNAME + WRDS_PASSWORD in env for premium academic access.
 */

const EDGAR_BASE = "https://efts.sec.gov/LATEST/search-index";
const EDGAR_SUBMISSIONS = "https://data.sec.gov/submissions";
const EDGAR_COMPANY = "https://efts.sec.gov/LATEST/search-index?q=%22";

export interface EdgarFiling {
  id:           string;
  entity_name:  string;
  file_date:    string;
  form:         string;
  period:       string;
  ticker?:      string;
  cik:          string;
  url:          string;
}

/** Search EDGAR full-text for recent filings by form type */
export async function searchFilings(opts: {
  query?: string;
  forms?: string[];     // e.g. ["4", "8-K", "10-Q"]
  dateFrom?: string;    // YYYY-MM-DD
  limit?: number;
}): Promise<EdgarFiling[]> {
  const { query = "", forms = [], dateFrom, limit = 20 } = opts;

  // Build clean query params
  const clean = new URLSearchParams();
  if (query)    clean.set("q",      query);
  if (dateFrom) { clean.set("dateRange", "custom"); clean.set("startdt", dateFrom); }
  if (forms.length) clean.set("forms", forms.join(","));
  clean.set("hits.hits._source", "entity_name,file_date,form_type,period_of_report");
  clean.set("hits.hits.total.relation", "gte");

  const url = `${EDGAR_BASE}?${clean.toString()}`;

  const res  = await fetch(url, { next: { revalidate: 60 }, headers: { "User-Agent": "CatalystWire/1.0 catalystwiredev@gmail.com" } });
  if (!res.ok) throw new Error(`EDGAR search failed: ${res.status}`);

  const data = await res.json();
  const hits: any[] = data?.hits?.hits ?? [];

  return hits.slice(0, limit).map((h: any) => {
    const s = h._source ?? {};
    return {
      id:          h._id ?? "",
      entity_name: s.entity_name ?? s.display_names?.[0]?.name ?? "",
      file_date:   s.file_date ?? "",
      form:        s.form_type ?? "",
      period:      s.period_of_report ?? "",
      ticker:      s.ticker ?? undefined,
      cik:         s.entity_id ?? "",
      url:         `https://www.sec.gov/Archives/edgar/data/${s.entity_id}/${h._id?.replace(/-/g, "")}.htm`,
    };
  });
}

/** Fetch recent Form 4 insider trade filings (free, public) */
export async function getRecentForm4s(limit = 20): Promise<EdgarFiling[]> {
  return searchFilings({ forms: ["4"], limit });
}

/** Fetch recent 8-K material event filings */
export async function getRecent8Ks(limit = 20): Promise<EdgarFiling[]> {
  return searchFilings({ forms: ["8-K"], limit });
}

/** Get company CIK from ticker symbol via EDGAR company search */
export async function getCIKByTicker(ticker: string): Promise<string | null> {
  const res = await fetch(
    `https://efts.sec.gov/LATEST/search-index?q=%22${encodeURIComponent(ticker)}%22&dateRange=&forms=`,
    { headers: { "User-Agent": "CatalystWire/1.0 catalystwiredev@gmail.com" } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data?.hits?.hits?.[0]?._source?.entity_id ?? null;
}

/** Get recent submissions for a known CIK */
export async function getCompanySubmissions(cik: string): Promise<any> {
  const paddedCik = cik.padStart(10, "0");
  const res = await fetch(
    `${EDGAR_SUBMISSIONS}/CIK${paddedCik}.json`,
    { next: { revalidate: 300 }, headers: { "User-Agent": "CatalystWire/1.0 catalystwiredev@gmail.com" } }
  );
  if (!res.ok) return null;
  return res.json();
}
