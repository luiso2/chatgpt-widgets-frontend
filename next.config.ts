import type { NextConfig } from "next";
import { baseURL } from "./baseUrl";

const nextConfig: NextConfig = {
  assetPrefix: baseURL, // Ensures /_next/ static assets load correctly in iframe
};

export default nextConfig;
