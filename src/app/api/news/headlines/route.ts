import { NextRequest, NextResponse } from "next/server";
import { getTopHeadlines, searchNews } from "@/lib/data/newsapi";
import { auth } from "@/lib/auth";
import { tierAtLeast } from "@/lib/tier";

export const runtime = "nodejs";
export const revalidate = 300;

/**
 * Top business headlines from NewsAPI.org.
 * Free tier: 10 latest. Alpha+: full pageSize, plus search query support.
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  const isPremium = tierAtLeast(session, "alpha");

  const url   = new URL(req.url);
  const q     = url.searchParams.get("q");
  const limit = isPremium ? Math.min(Number(url.searchParams.get("limit") ?? 30), 100) : 10;

  // Search is Alpha+ only; free tier just gets top headlines
  if (q && isPremium) {
    const articles = await searchNews(q, { pageSize: limit });
    return NextResponse.json({ count: articles.length, articles, premium: isPremium, mode: "search" });
  }

  const articles = await getTopHeadlines({ pageSize: limit });
  return NextResponse.json({ count: articles.length, articles, premium: isPremium, mode: "top-headlines" });
}
