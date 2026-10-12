import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Shared workspace package ships TypeScript source
  transpilePackages: ['@nexstate/brand'],
  // Enable standalone output for Docker
  output: 'standalone',
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Only hosts the site actually loads images from. Never use a '**' wildcard here:
    // it turns the image optimizer into an open proxy for anyone on the internet.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'randomuser.me' },
      // Supabase Storage (uploaded property/blog media)
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

export default nextConfig;
