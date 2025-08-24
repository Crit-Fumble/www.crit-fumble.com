/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Ensure the correct favicon is served
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/app/favicon.ico',
        permanent: true,
      },
    ];
  },
  // Add other configuration options as needed
};

module.exports = nextConfig;
