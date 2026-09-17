import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: projectRoot,
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
      ]
    }];
  },
  async rewrites() {
    const apiUrl = process.env.API_PROXY_TARGET || process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl && apiUrl.startsWith("http")) {
      const cleanTarget = apiUrl.replace(/\/api\/?$/, "");
      return [
        { source: "/api/:path*", destination: `${cleanTarget}/api/:path*` }
      ];
    }
    return [
      { source: "/api/:path*", destination: "http://localhost:4000/api/:path*" }
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" }
    ]
  }
};

export default nextConfig;
