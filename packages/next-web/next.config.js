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
      {
        protocol: 'https',
        hostname: '1qxvvbsathkgswhg.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Favicon should be automatically served from public or app directory
  /* Removed incorrect redirect that was causing favicon issues */
  // Add other configuration options as needed
};

export default nextConfig;
