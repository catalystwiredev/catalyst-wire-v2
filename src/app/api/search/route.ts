import { NextRequest, NextResponse } from "next/server";
import { searchDocuments } from "@/lib/azure-search";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const top   = parseInt(searchParams.get("top") ?? "20", 10);

  if (!query) {
    return NextResponse.json({ hits: [], nbHits: 0, query: "" });
  }

  try {
    const hits = await searchDocuments(query, Math.min(top, 50));
    return NextResponse.json({ hits, nbHits: hits.length, query });
  } catch (err) {
    console.error("[api/search]", err);
    return NextResponse.json({ hits: [], nbHits: 0, query, error: "Search unavailable" }, { status: 200 });
  }
}
