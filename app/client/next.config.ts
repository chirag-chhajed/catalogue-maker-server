import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       destination: "https://605l6z6z-3434.inc1.devtunnels.ms/api/:path*",
  //     },
  //   ];
  // },
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
