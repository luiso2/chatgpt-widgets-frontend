// Base URL configuration for Railway deployment
export const baseURL =
  process.env.RAILWAY_PUBLIC_DOMAIN
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
