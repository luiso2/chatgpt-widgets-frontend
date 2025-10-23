import type { NextConfig } from "next";
import { baseURL } from "./baseUrl";

const nextConfig: NextConfig = {
  assetPrefix: baseURL, // Ensures /_next/ static assets load correctly in iframe

  // Optimize production build
  reactStrictMode: true,

  // Optimize images
  images: {
    domains: ['picsum.photos', 'i.pravatar.cc', 'example.com'],
    unoptimized: true, // For Railway deployment
  },

  // Reduce bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Output config for Railway
  output: 'standalone',
};

export default nextConfig;
