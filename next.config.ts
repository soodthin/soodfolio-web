import type { NextConfig } from "next";

const backendOrigin = (
  process.env.API_INTERNAL_URL?.replace(/\/api\/v1\/?$/, '') ||
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'http://localhost:8080'
).replace(/\/+$/, '');

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendOrigin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
