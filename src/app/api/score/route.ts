import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { scoreCatalyst } from "@/lib/azure-openai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

const schema = z.object({
  ticker:      z.string().min(1).max(10).toUpperCase(),
  description: z.string().min(5).max(2000),
  formType:    z.string().max(20).optional(),
  price:       z.number().positive().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body   = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 });
    }

    const result = await scoreCatalyst(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/score]", err);
    return NextResponse.json({ error: "Scoring unavailable" }, { status: 500 });
  }
}
