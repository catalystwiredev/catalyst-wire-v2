import { SearchClient, SearchIndexClient, AzureKeyCredential, SearchIndex } from "@azure/search-documents";

const ENDPOINT = process.env.AZURE_SEARCH_ENDPOINT ?? "";
const KEY      = process.env.AZURE_SEARCH_KEY       ?? "";
const INDEX    = "catalysts";

function getSearchClient() {
  if (!ENDPOINT || !KEY) throw new Error("AZURE_SEARCH_ENDPOINT or AZURE_SEARCH_KEY not set");
  return new SearchClient(ENDPOINT, INDEX, new AzureKeyCredential(KEY));
}

function getIndexClient() {
  if (!ENDPOINT || !KEY) throw new Error("AZURE_SEARCH_ENDPOINT or AZURE_SEARCH_KEY not set");
  return new SearchIndexClient(ENDPOINT, new AzureKeyCredential(KEY));
}

export interface SearchableDocument {
  id:          string;
  ticker?:     string;
  title:       string;
  description: string;
  url?:        string;
  type:        string;
  date?:       string;
  score?:      number;
}

export async function searchDocuments(query: string, top = 20): Promise<SearchableDocument[]> {
  const client  = getSearchClient();
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
  const client = getSearchClient();
  await client.uploadDocuments(docs);
}

export async function deleteDocument(id: string): Promise<void> {
  const client = getSearchClient();
  await client.deleteDocuments([{ id }]);
}

/** Ensure the index exists — call once during setup */
export async function ensureIndex(): Promise<void> {
  const client = getIndexClient();
  const index: SearchIndex = {
    name:   INDEX,
    fields: [
      { name: "id",          type: "Edm.String",  key: true,  searchable: false },
      { name: "ticker",      type: "Edm.String",  searchable: true,  filterable: true },
      { name: "title",       type: "Edm.String",  searchable: true,  analyzerName: "en.microsoft" },
      { name: "description", type: "Edm.String",  searchable: true,  analyzerName: "en.microsoft" },
      { name: "url",         type: "Edm.String",  searchable: false },
      { name: "type",        type: "Edm.String",  filterable: true,  searchable: false },
      { name: "date",        type: "Edm.String",  sortable: true,    searchable: false },
      { name: "score",       type: "Edm.Int32",   sortable: true,    searchable: false },
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
