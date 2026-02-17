import { withSentryConfig } from "@sentry/nextjs";
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
    // Prevent @opentelemetry from being bundled (avoids vendor-chunks path errors)
    serverComponentsExternalPackages: ["@opentelemetry/api"],
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

export default withSentryConfig(withBundleAnalyzer(nextConfig), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "blackacre-llc",

  project: "central-park-news",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
