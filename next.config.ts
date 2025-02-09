import type { NextConfig } from "next";

const nextConfig = {
  experimental: {
    esmExternals: "loose", // Allow ES Modules
  },
};

export default nextConfig;
