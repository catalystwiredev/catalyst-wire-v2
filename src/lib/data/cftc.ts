const BASE = "https://publicreporting.cftc.gov/resource/jun7-fc8e.json";

export interface COTRow {
  market_and_exchange_names: string;
  report_date_as_yyyy_mm_dd: string;
  open_interest_all: number;
  comm_positions_long_all: number;
  comm_positions_short_all: number;
  noncomm_positions_long_all: number;
  noncomm_positions_short_all: number;
  nonrept_positions_long_all: number;
  nonrept_positions_short_all: number;
  change_in_comm_long_all: number;
  change_in_comm_short_all: number;
  change_in_noncomm_long_all: number;
  change_in_noncomm_short_all: number;
}

interface RawCOT {
  market_and_exchange_names?: string;
  report_date_as_yyyy_mm_dd?: string;
  open_interest_all?: string;
  comm_positions_long_all?: string;
  comm_positions_short_all?: string;
  noncomm_positions_long_all?: string;
  noncomm_positions_short_all?: string;
  nonrept_positions_long_all?: string;
  nonrept_positions_short_all?: string;
  change_in_comm_long_all?: string;
  change_in_comm_short_all?: string;
  change_in_noncomm_long_all?: string;
  change_in_noncomm_short_all?: string;
}

const N = (s: string | undefined): number => s ? Number(s) : 0;

function map(r: RawCOT): COTRow {
  return {
    market_and_exchange_names: r.market_and_exchange_names ?? "",
    report_date_as_yyyy_mm_dd: (r.report_date_as_yyyy_mm_dd ?? "").slice(0, 10),
    open_interest_all: N(r.open_interest_all),
    comm_positions_long_all: N(r.comm_positions_long_all),
    comm_positions_short_all: N(r.comm_positions_short_all),
    noncomm_positions_long_all: N(r.noncomm_positions_long_all),
    noncomm_positions_short_all: N(r.noncomm_positions_short_all),
    nonrept_positions_long_all: N(r.nonrept_positions_long_all),
    nonrept_positions_short_all: N(r.nonrept_positions_short_all),
    change_in_comm_long_all: N(r.change_in_comm_long_all),
    change_in_comm_short_all: N(r.change_in_comm_short_all),
    change_in_noncomm_long_all: N(r.change_in_noncomm_long_all),
    change_in_noncomm_short_all: N(r.change_in_noncomm_short_all),
  };
}

export async function getRecentCOTReports(opts: { marketContains?: string; limit?: number } = {}): Promise<COTRow[]> {
  const { marketContains, limit = 50 } = opts;
  const params = new URLSearchParams({
    "$limit": String(Math.min(limit, 1000)),
    "$order": "report_date_as_yyyy_mm_dd DESC",
  });
  if (marketContains) {
    params.set("$where", `upper(market_and_exchange_names) like upper('%${marketContains.replace(/'/g, "''")}%')`);
  }
  try {
    const res = await fetch(`${BASE}?${params}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const arr = await res.json() as RawCOT[];
    return arr.map(map);
  } catch (err) {
    console.error("[cftc] fetch failed:", err);
    return [];
  }
}

export function netPositioning(row: COTRow) {
  return {
    commercial: row.comm_positions_long_all - row.comm_positions_short_all,
    nonCommercial: row.noncomm_positions_long_all - row.noncomm_positions_short_all,
    nonReportable: row.nonrept_positions_long_all - row.nonrept_positions_short_all,
  };
}
