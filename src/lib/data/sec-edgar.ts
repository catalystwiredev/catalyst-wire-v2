/**
 * SEC EDGAR Full-Text Search API (free, no auth required)
 * Docs: https://efts.sec.gov/LATEST/search-index?q=...
 *
 * Premium: leverage WRDS CRSP/Compustat for deeper filing data.
 * Set WRDS_USERNAME + WRDS_PASSWORD in env for institutional access.
 */

const EDGAR_BASE = "https://efts.sec.gov/LATEST/search-index";
const EDGAR_SUBMISSIONS = "https://data.sec.gov/submissions";

export interface EdgarFiling {
  id:                  string;
  companyName:         string;
  formType:            string;
  filedAt:             string;  // ISO 8601
  periodOfReport:      string;
  ticker?:             string;
  linkToFilingDetails: string;
  description:         string;
}

/** Search EDGAR full-text for recent filings by form type */
export async function searchFilings(opts: {
  query?: string;
  forms?: string[];     // e.g. ["4", "8-K", "10-Q"]
  dateFrom?: string;    // YYYY-MM-DD
  limit?: number;
}): Promise<EdgarFiling[]> {
  const { query = "", forms = [], dateFrom, limit = 20 } = opts;

  const clean = new URLSearchParams();
  if (query)    clean.set("q",      query);
  if (dateFrom) { clean.set("dateRange", "custom"); clean.set("startdt", dateFrom); }
  if (forms.length) clean.set("forms", forms.join(","));

  const url = `${EDGAR_BASE}?${clean.toString()}`;

  const res  = await fetch(url, { next: { revalidate: 60 }, headers: { "User-Agent": "CatalystWire/1.0 catalystwiredev@gmail.com" } });
  if (!res.ok) throw new Error(`EDGAR search failed: ${res.status}`);

  const data = await res.json();
  const hits: any[] = data?.hits?.hits ?? [];

  return hits.slice(0, limit).map((h: any) => {
    const s = h._source ?? {};
    const cik = s.entity_id ?? s.file_num ?? "";
    const accNum = (h._id ?? "").replace(/-/g, "");
    const filingIndexUrl = cik && accNum
      ? `https://www.sec.gov/Archives/edgar/data/${cik}/${accNum}/${accNum}-index.htm`
      : `https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=${s.form_type ?? ""}&dateb=&owner=include&count=40`;
    return {
      id:                  h._id ?? "",
      companyName:         s.entity_name ?? s.display_names?.[0]?.name ?? "",
      formType:            s.form_type ?? "",
      filedAt:             s.file_date ? new Date(s.file_date).toISOString() : "",
      periodOfReport:      s.period_of_report ?? "",
      ticker:              s.tickers?.[0] ?? s.ticker ?? undefined,
      linkToFilingDetails: filingIndexUrl,
      description:         s.form_type ? `${s.form_type} filed by ${s.entity_name ?? "unknown entity"}` : "",
    };
  });
}

/** Fetch recent Form 4 insider trade filings (free, public) */
export async function getRecentForm4s(limit = 20): Promise<EdgarFiling[]> {
  const since = new Date(Date.now() - 45 * 86400000).toISOString().split("T")[0];
  return searchFilings({ forms: ["4"], dateFrom: since, limit });
}

/** Fetch recent 8-K material event filings */
export async function getRecent8Ks(limit = 20): Promise<EdgarFiling[]> {
  const since = new Date(Date.now() - 45 * 86400000).toISOString().split("T")[0];
  return searchFilings({ forms: ["8-K"], dateFrom: since, limit });
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
