import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],

  // applicationinsights uses dynamic requires that bundlers can't trace statically
  serverExternalPackages: ["applicationinsights", "tedious"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.githubusercontent.com" },
      { protocol: "https", hostname: "**.alphaadvantage.co" },
    ],
  },

  async headers() {
    return [
      {
        source: "/api/stripe/webhook",
        headers: [{ key: "Content-Type", value: "text/plain" }],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",    value: "nosniff" },
          { key: "X-Frame-Options",           value: "DENY" },
          { key: "X-XSS-Protection",          value: "1; mode=block" },
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
