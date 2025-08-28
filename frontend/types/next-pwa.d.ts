declare module "next-pwa" {
  import type { NextConfig } from "next";

  export interface PWAOptions {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    runtimeCaching?: unknown;
    buildExcludes?: string[];
    [key: string]: unknown;
  }

  export default function withPWA(
    options?: PWAOptions
  ): (nextConfig?: NextConfig) => NextConfig;
}


