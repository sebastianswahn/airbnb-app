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
    domains: ["your-image-domain.com"],
  },
  experimental: {
    appDir: true,
  },
};

export default nextConfig;
