import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    useCache: true,
  },
  reactStrictMode: false
};

export default nextConfig;
