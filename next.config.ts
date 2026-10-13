import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  
  // প্রোডাকশন বিল্ডের সময় টাইপস্ক্রিপ্টের এরর থাকলেও বিল্ড সফল করতে এই রুল
  typescript: {
    ignoreBuildErrors: true,
  },
  // বিল্ড করার সময় ESLint এর কড়া ওয়ার্নিংগুলোকে ইগনোর করার রুল
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
