import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    images: {
        qualities: [25, 50, 75, 100],
        remotePatterns: [
            { protocol: 'https', hostname: 'cdn.login.no', pathname: '/**' },
        ],
    },
}

export default nextConfig
