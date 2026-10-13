import type { NextConfig } from "next";

const baseConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
};

// অবজেক্টটিকে এক্সপোর্ট করার আগে একটি ভ্যারিয়েবলে অ্যাসাইন করা (ESLint Rule Fix)
const finalConfig = {
  ...baseConfig,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default finalConfig;
