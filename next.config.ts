import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
};

// নেক্সট-জেএস ১৬ টাইপ অবজেক্টের এরর ইগনোর করার অফিশিয়াল মেথড
const finalConfig = Object.assign({}, nextConfig, {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
});

export default finalConfig;
