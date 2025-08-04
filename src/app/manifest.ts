import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Palitan Tayo',
		description: 'Your Online Community Bartering Platform',
		start_url: '/',
		display: 'standalone',
		icons: [
			{
				src: '/favicon.ico',
				sizes: '64x64 32x32 24x24 16x16',
				type: 'image/x-icon'
			}
		]
	};
}
