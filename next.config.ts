import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
