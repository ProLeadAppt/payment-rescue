import type { NextConfig } from "next";

const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Redirect /setup to a setup page
  async redirects() {
    return [];
  },
};

export default nextConfig;
