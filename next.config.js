/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Disable static generation and caching
  experimental: {
    // Disable static optimization
    staticPageGenerationTimeout: 0,
  },

  // Disable image optimization caching
  images: {
    unoptimized: true,
  },

  // Disable static file caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
