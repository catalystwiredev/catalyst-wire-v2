import { NextRequest, NextResponse } from "next/server";
import { indexDocuments, ensureIndex, SearchableDocument } from "@/lib/azure-search";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json() as { documents?: SearchableDocument[]; ensureIndex?: boolean };

    if (body.ensureIndex) {
      await ensureIndex();
    }

    if (body.documents?.length) {
      await indexDocuments(body.documents);
    }

    return NextResponse.json({ ok: true, indexed: body.documents?.length ?? 0 });
  } catch (err) {
    console.error("[api/search/index]", err);
    return NextResponse.json({ error: "Indexing failed" }, { status: 500 });
  }
}
