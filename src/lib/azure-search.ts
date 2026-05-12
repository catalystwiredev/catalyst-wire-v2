import { SearchClient, SearchIndexClient, AzureKeyCredential, SearchIndex } from "@azure/search-documents";
import { getSecret } from "./azure-secrets";

const INDEX = "catalysts";

let searchClient: SearchClient<any> | null = null;
let indexClient: SearchIndexClient | null = null;

async function getSearchClient(): Promise<SearchClient<any>> {
  if (searchClient) return searchClient;

  const endpoint = await getSecret("AZURE-SEARCH-ENDPOINT");
  const key = await getSecret("AZURE-SEARCH-KEY");

  searchClient = new SearchClient(endpoint, INDEX, new AzureKeyCredential(key));
  return searchClient;
}

async function getIndexClient(): Promise<SearchIndexClient> {
  if (indexClient) return indexClient;

  const endpoint = await getSecret("AZURE-SEARCH-ENDPOINT");
  const key = await getSecret("AZURE-SEARCH-KEY");

  indexClient = new SearchIndexClient(endpoint, new AzureKeyCredential(key));
  return indexClient;
}

export interface SearchableDocument {
  id: string;
  ticker?: string;
  title: string;
  description: string;
  url?: string;
  type: string;
  date?: string;
  score?: number;
}

export async function searchDocuments(query: string, top = 20): Promise<SearchableDocument[]> {
  const client = await getSearchClient();
  const results = await client.search(query, {
    top,
    select: ["id", "ticker", "title", "description", "url", "type", "date", "score"],
    queryType: "simple",
  });
  const docs: SearchableDocument[] = [];
  for await (const result of results.results) {
    docs.push(result.document as SearchableDocument);
  }
  return docs;
}

export async function indexDocuments(docs: SearchableDocument[]): Promise<void> {
  const client = await getSearchClient();
  await client.uploadDocuments(docs);
}

export async function deleteDocument(id: string): Promise<void> {
  const client = await getSearchClient();
  await client.deleteDocuments([{ id }]);
}

/** Ensure the index exists — call once during setup */
export async function ensureIndex(): Promise<void> {
  const client = await getIndexClient();
  const index: SearchIndex = {
    name: INDEX,
    fields: [
      { name: "id", type: "Edm.String", key: true, searchable: false },
      { name: "ticker", type: "Edm.String", searchable: true, filterable: true },
      { name: "title", type: "Edm.String", searchable: true, analyzerName: "en.microsoft" },
      { name: "description", type: "Edm.String", searchable: true, analyzerName: "en.microsoft" },
      { name: "url", type: "Edm.String", searchable: false },
      { name: "type", type: "Edm.String", filterable: true, searchable: false },
      { name: "date", type: "Edm.String", sortable: true, searchable: false },
      { name: "score", type: "Edm.Int32", sortable: true, searchable: false },
    ],
    scoringProfiles: [
      {
        name: "freshness",
        functionAggregation: "sum",
        functions: [
          { type: "freshness", fieldName: "date", boost: 5, parameters: { boostingDuration: "P30D" }, interpolation: "linear" },
        ],
      },
    ],
  };
  try {
    await client.createOrUpdateIndex(index);
  } catch {
    // index may already exist — not fatal
  }
}
