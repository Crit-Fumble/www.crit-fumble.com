/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.discordapp.com',
                pathname: '/avatars/**',
            },
            {
                protocol: 'https',
                hostname: '1qxvvbsathkgswhg.public.blob.vercel-storage.com',
                pathname: '/character-sheets/**',
            }
        ]
    }
};

export default nextConfig;
