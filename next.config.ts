import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	turbopack: {
		// Avoid workspace root inference panics in Next 16+ using PostCSS
		// @ts-ignore
		root: __dirname,
	},
	images: {
    unoptimized:true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "api.dicebear.com",
				port: "",
				pathname: "/7.x/**",
			},
		],
	},

};

export default nextConfig;
