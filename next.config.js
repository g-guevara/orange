/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['example.com'], // Add your image domains here
  },
  experimental: {
    serverComponentsExternalPackages: ['mongodb', 'bcryptjs'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Optimize for production builds
  swcMinify: true,
  // Enable static generation where possible
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  // Configure redirects if needed
  async redirects() {
    return [
      // Add redirects here if needed
    ];
  },
  // Configure rewrites if needed
  async rewrites() {
    return [
      // Add rewrites here if needed
    ];
  },
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;