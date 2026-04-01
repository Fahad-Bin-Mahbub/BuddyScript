import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Avoid workspace root inference panics in Next 16+ using PostCSS 
    // @ts-ignore
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
