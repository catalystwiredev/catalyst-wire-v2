/**
 * OpenFDA API — free, public FDA data
 * Secret: OPENFDA-API-KEY (from Azure Key Vault, optional for higher limits)
 * Docs: https://open.fda.gov/apis/
 */
import { getSecret } from "../azure-secrets";

const BASE = "https://api.fda.gov";

async function qs(extra: Record<string, string> = {}): Promise<string> {
  const params: Record<string, string> = { ...extra };
  try {
    const k = await getSecret("OPENFDA-API-KEY");
    if (k) params.api_key = k;
  } catch {
    // API key is optional
  }
  return new URLSearchParams(params).toString();
}

export interface DrugApplication {
  application_number: string;
  sponsor_name: string;
  products: { brand_name: string; active_ingredients: { name: string; strength: string }[]; dosage_form: string; marketing_status: string }[];
}

export interface DrugAdverseEvent {
  safetyreportid: string;
  receivedate: string;
  seriousness: string;
  patient: {
    reaction: { reactionmeddrapt: string }[];
    drug: { medicinalproduct: string; openfda?: { brand_name?: string[] } }[];
  };
}

export interface DrugRecall {
  recall_number: string;
  product_description: string;
  reason_for_recall: string;
  recall_initiation_date: string;
  classification: string;
  status: string;
  recalling_firm: string;
}

/** Search FDA drug applications (NDAs, BLAs, ANDAs) */
export async function searchDrugApplications(query: string, limit = 10): Promise<DrugApplication[]> {
  const url = `${BASE}/drug/drugsfda.json?${await qs({ search: query, limit: String(limit) })}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.results ?? []).map((r: any) => ({
    application_number: r.application_number,
    sponsor_name: r.sponsor_name,
    products: (r.products ?? []).map((p: any) => ({
      brand_name: p.brand_name,
      active_ingredients: p.active_ingredients ?? [],
      dosage_form: p.dosage_form,
      marketing_status: p.marketing_status,
    })),
  }));
}

/** Get recent drug adverse event reports */
export async function getAdverseEvents(drugName: string, limit = 10): Promise<DrugAdverseEvent[]> {
  const query = `patient.drug.medicinalproduct:"${drugName}"`;
  const url = `${BASE}/drug/event.json?${await qs({ search: query, limit: String(limit), sort: "receivedate:desc" })}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.results ?? [];
}

/** Get recent FDA drug recalls */
export async function getDrugRecalls(limit = 20): Promise<DrugRecall[]> {
  const url = `${BASE}/drug/enforcement.json?${await qs({ limit: String(limit), sort: "recall_initiation_date:desc" })}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.results ?? []).map((r: any) => ({
    recall_number: r.recall_number,
    product_description: r.product_description,
    reason_for_recall: r.reason_for_recall,
    recall_initiation_date: r.recall_initiation_date,
    classification: r.classification,
    status: r.status,
    recalling_firm: r.recalling_firm,
  }));
}

/** Get recent medical device recalls */
export async function getDeviceRecalls(limit = 20): Promise<DrugRecall[]> {
  const url = `${BASE}/device/enforcement.json?${await qs({ limit: String(limit), sort: "recall_initiation_date:desc" })}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.results ?? [];
}
