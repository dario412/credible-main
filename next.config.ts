import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Media library uploads allow up to 4 MB; default Server Action limit is 1 MB.
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
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
        hostname: "pub-57bb815d6d4349d7897901b4c2641375.r2.dev",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
    ],
    localPatterns: [
      { pathname: "/api/media/**", search: "" },
      { pathname: "/images/**", search: "" },
      { pathname: "/brand/**", search: "" },
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
      {
        source: "/v2",
        destination: "/",
        permanent: true,
      },
      {
        source: "/v2-about",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/v2-what-we-do",
        destination: "/what-we-do",
        permanent: true,
      },
      {
        source: "/accessibility-statement",
        destination: "/accessibility",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
