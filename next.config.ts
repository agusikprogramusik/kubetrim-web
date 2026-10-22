import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const hubApiUrl = process.env.NEXT_PUBLIC_HUB_API_URL || "http://localhost:8090";
    return [
      {
        source: "/api/v1/:path*",
        destination: `${hubApiUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
