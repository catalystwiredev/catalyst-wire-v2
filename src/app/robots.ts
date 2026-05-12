import { MetadataRoute } from "next";

const BASE = process.env.NEXTAUTH_URL ?? "https://catalystwire.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard", 
          "/account", 
          "/watchlist", 
          "/api/", 
          "/register/success"
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
