/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}
module.exports = nextConfig
module.exports = {
    async headers() {
        return [
          {
            source: '/:path*', // Match all routes
            headers: [
              {
                key: 'Cache-Control',
                value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
              },
            ],
          },
        ];
      },
}