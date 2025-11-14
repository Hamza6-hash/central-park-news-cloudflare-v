/** @type {import('next').NextConfig} */

import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    // performance optimization
    optimizeCss: true, // Enables CSS optimization and critical CSS extraction
    optimizePackageImports: [
      "firebase",
      "swiper",
      "@radix-ui/react-dialog",
      "react-markdown",
      "lucide-react",
    ],
  },
  // Performance optimizations
  compress: true, // Enable gzip compression
  // Optimize font loading
  optimizeFonts: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:5328/api/:path*",
      },
      {
        source: "/api/:path*",
        destination: "https://central-park-news.vercel.app/api/:path*",
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
