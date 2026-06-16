import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",        value: "DENY" },
          { key: "X-Content-Type-Options",  value: "nosniff" },
          { key: "Referrer-Policy",         value: "origin-when-cross-origin" },
          { key: "X-XSS-Protection",        value: "1; mode=block" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(self), geolocation=()",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control",           value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Type",            value: "application/javascript; charset=utf-8" },
        ],
      },
    ];
  },
};

export default nextConfig;
