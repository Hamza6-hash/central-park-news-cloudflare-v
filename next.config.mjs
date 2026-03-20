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
    serverComponentsExternalPackages: ["@opentelemetry/api"],
    optimizeCss: true,
    optimizePackageImports: [
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
  compress: true,
  optimizeFonts: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-336ef3681b5b432ba1f03247c9fb8bba.r2.dev",
        pathname: "/**",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  transpilePackages: [],

  // Configure webpack for Cloudflare Workers compatibility
  webpack: (config, { isServer, nextRuntime }) => {
    if (nextRuntime === "edge") {
      // For Edge Runtime routes running on Cloudflare Workers with nodejs_compat,
      // Node.js built-ins must be externals (not bundled).
      // Cloudflare's nodejs_compat provides them at runtime via require().
      const nodeBuiltins = ["net", "tls", "path", "fs", "dns", "stream", "os", "crypto", "string_decoder"];
      const existingExternals = Array.isArray(config.externals)
        ? config.externals
        : config.externals
        ? [config.externals]
        : [];
      config.externals = [
        ...existingExternals,
        ({ request }, callback) => {
          if (nodeBuiltins.includes(request)) {
            // Use node: prefix so esbuild (used by @cloudflare/next-on-pages)
            // recognises them as external via its "node:*" pattern.
            return callback(null, `commonjs node:${request}`);
          }
          if (request === "pg-native") {
            return callback(null, `commonjs node:pg-native`);
          }
          callback();
        },
      ];
    }

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },

};

// withSentryConfig is intentionally NOT used here.
// Sentry's webpack plugin injects a debug-ID IIFE into every webpack chunk,
// producing duplicate module identifiers that break @cloudflare/next-on-pages.
// Error monitoring still works via Sentry.init() in sentry.edge.config.ts.
export default withBundleAnalyzer(nextConfig);
