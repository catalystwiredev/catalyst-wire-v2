import { NextRequest, NextResponse } from "next/server";
import { algoliasearch } from "algoliasearch";

export const runtime = "nodejs";

const INDEX = "catalysts";

function getClient() {
  const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  const key   = process.env.ALGOLIA_ADMIN_KEY ?? process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY;
  if (!appId || !key) throw new Error("Algolia env vars not set");
  return algoliasearch(appId, key);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const page  = parseInt(searchParams.get("page") ?? "0", 10);

  if (!query) {
    return NextResponse.json({ hits: [], nbHits: 0, query: "" });
  }

  try {
    const client = getClient();
    const result = await client.searchSingleIndex({
      indexName: INDEX,
      searchParams: { query, page, hitsPerPage: 20 },
    });

    return NextResponse.json({
      hits:   result.hits,
      nbHits: result.nbHits,
      query,
      page:   result.page,
      pages:  result.nbPages,
    });
  } catch (err) {
    console.error("[api/search]", err);
    return NextResponse.json({ hits: [], nbHits: 0, query, error: "Search unavailable" }, { status: 200 });
  }
}
