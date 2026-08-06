import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dl.airtable.com",
      },
      {
        protocol: "https",
        hostname: "v5.airtableusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.airtableusercontent.com",
      },
      {
        protocol: "https",
        hostname: "pub-57bb815d6d4349d7897801b4c2641375.r2.dev",
      },
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/home-2",
        destination: "/",
        permanent: true,
      },
      {
        source: "/home-2/:path*",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
