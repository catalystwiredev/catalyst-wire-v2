import { MetadataRoute } from "next";

const BASE = process.env.NEXTAUTH_URL ?? "https://catalystwire.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const publicRoutes = [
    { url: `${BASE}/`,                  priority: 1.0 },
    { url: `${BASE}/pricing`,           priority: 0.9 },
    { url: `${BASE}/news`,              priority: 0.8 },
    { url: `${BASE}/login`,             priority: 0.7 },
    { url: `${BASE}/register`,          priority: 0.7 },
    { url: `${BASE}/about`,             priority: 0.6 },
    { url: `${BASE}/contact`,           priority: 0.5 },
    { url: `${BASE}/glossary`,          priority: 0.6 },
    { url: `${BASE}/calculators`,       priority: 0.6 },
    { url: `${BASE}/live-catalysts`,    priority: 0.8 },
    { url: `${BASE}/sec-filings`,       priority: 0.7 },
    { url: `${BASE}/insider-trades`,    priority: 0.7 },
    { url: `${BASE}/congressional-trades`, priority: 0.6 },
    { url: `${BASE}/earnings`,          priority: 0.7 },
    { url: `${BASE}/fda-decisions`,     priority: 0.6 },
    { url: `${BASE}/scanners`,          priority: 0.7 },
    { url: `${BASE}/calendars`,         priority: 0.6 },
    { url: `${BASE}/themes`,            priority: 0.5 },
    { url: `${BASE}/privacy`,           priority: 0.3 },
    { url: `${BASE}/terms`,             priority: 0.3 },
    { url: `${BASE}/donate`,            priority: 0.4 },
  ];

  return publicRoutes.map(({ url, priority }) => ({
    url,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority,
  }));
}
