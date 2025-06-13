/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
 
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "firebasestorage.googleapis.com",
//         pathname: "/**", // allow all Firebase Storage paths
//       },
//     ],
//     // domains: ['firebasestorage.googleapis.com'],
//   },
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         destination: "http://127.0.0.1:5328/api/:path*",
//       },
//       {
//         source: "/api/:path*",
//         destination: "https://blockchain-briefing.vercel.app/api/:path*",
//       },
//     ];
//   },
// };

// export default nextConfig;


// ---------------------------------------------------------------------------------

// next.config.mjs

// Correct ES module import for the bundle analyzer
// Note: This needs to be at the top-level.
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
 
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**", // allow all Firebase Storage paths
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:5328/api/:path*",
      },
      {
        source: "/api/:path*",
        destination: "https://blockchain-briefing.vercel.app/api/:path*",
      },
    ];
  },
};

// Export the wrapped config
// Pass your existing nextConfig into the withBundleAnalyzer function
export default withBundleAnalyzer(nextConfig);