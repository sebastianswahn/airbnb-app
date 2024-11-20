/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": "./src",
    };
    return config;
  },
  images: {
    domains: ["your-image-domain.com"], // Add your image domains here
  },
  // Enable experimental features if needed
  experimental: {
    appDir: true,
  },
};

export default nextConfig;
