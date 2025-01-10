import { env } from "@/env.mjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `https://catalogue-maker.fly.dev/api/:path*`,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: true,
  // https://merapyaraawskabucket.s3.ap-south-1.amazonaws.com/eh98G2YzVfqo/PhNaw9edheORbJlxA5Z__.webp,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "merapyaraawskabucket.s3.ap-south-1.amazonaws.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
