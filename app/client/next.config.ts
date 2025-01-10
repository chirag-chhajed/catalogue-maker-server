import { env } from "@/env.mjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
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
