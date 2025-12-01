/** @type {import('next').NextConfig} */

import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Target modern browsers to avoid unnecessary polyfills
  // Modern browsers support ES2022 features natively (Array.at, Object.fromEntries, etc.)
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
      "@radix-ui/react-label",
      "@radix-ui/react-slot",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toast",
      "react-markdown",
      "lucide-react",
      "react-icons",
      "embla-carousel-react",
      "date-fns",
      "vanilla-cookieconsent",
    ],
  },
  // Performance optimizations
  compress: true, // Enable gzip compression
  // Optimize font loading
  optimizeFonts: true,
  poweredByHeader: false,
  // Optimize production builds
  productionBrowserSourceMaps: false, // Disable source maps in production to reduce bundle size
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
  // Optional: skip transpiling some packages
  transpilePackages: [],

  // Configure webpack to exclude unnecessary polyfills for modern browsers
  webpack: (config, { isServer }) => {
    // Exclude polyfills that are not needed for modern browsers
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Prevent polyfills from being included
        fs: false,
        net: false,
        tls: false,
      };
      
      // Exclude core-js polyfills for modern browser features
      config.resolve.alias = {
        ...config.resolve.alias,
        // Prevent automatic polyfill injection
      };
    }
    return config;
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
