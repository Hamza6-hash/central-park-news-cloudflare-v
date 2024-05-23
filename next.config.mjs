/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://127.0.0.1:5328/api/:path*',
        },
        {
            source: '/api/:path*',
            destination: 'https://blockchain-briefing.vercel.app/api/:path*',
          },
      ];
    },
  };
  
  export default nextConfig;
  