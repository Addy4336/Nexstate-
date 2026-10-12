
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Shared workspace package ships TypeScript source
  transpilePackages: ['@nexstate/brand'],


  // Enable standalone output for Docker
  // output: 'standalone',

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        // Supabase Storage - matches any Supabase project
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    // Limit concurrency for Docker builds to prevent OOM
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
