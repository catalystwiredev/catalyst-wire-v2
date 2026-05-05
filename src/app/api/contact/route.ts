import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveContactMessage } from "@/lib/azure-db";

const schema = z.object({
  name:    z.string().min(1).max(120),
  email:   z.string().email().max(254),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
});

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 });
    }

    const { name, email, subject, message } = parsed.data;
    await saveContactMessage(name, email, subject, message);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/contact]", err);
    return NextResponse.json({ error: "Failed to save message. Please try again." }, { status: 500 });
  }
}
