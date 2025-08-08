import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
			},
		],
	},
	serverExternalPackages: ['@prisma/client'],
	output: 'standalone',
	experimental: {
		globalNotFound: true,
		serverActions: {
			bodySizeLimit: "10mb",
		}
	},
};

export default nextConfig;
