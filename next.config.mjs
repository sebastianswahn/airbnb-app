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
    domains: ["images.unsplash.com", "scontent.fbma4-1.fna.fbcdn.net"], // Updated this line
  },
  experimental: {
    appDir: true,
  },
};

export default nextConfig;
