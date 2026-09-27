/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from any source for logo
  images: {
    remotePatterns: [],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Experimental features
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
};

export default nextConfig;
