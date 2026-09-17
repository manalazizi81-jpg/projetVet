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
    // En développement npm, Next.js transmet /api au service NestJS local.
    // En production, vercel.json route /api directement vers le service API.
    return process.env.VERCEL ? [] : [
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
