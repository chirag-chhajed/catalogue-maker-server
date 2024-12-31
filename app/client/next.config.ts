import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://605l6z6z-3434.inc1.devtunnels.ms/api/:path*",
      },
    ];
  },
};

export default nextConfig;
