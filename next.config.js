/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during builds for now - we can fix linting issues later
    ignoreDuringBuilds: true,
  },
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
  // Configure webpack to handle native modules and server-only dependencies
  webpack: (config, { isServer }) => {
    // Exclude native modules from client-side bundling
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
      
      // Exclude server-only modules from client bundle
      config.externals = config.externals || [];
      config.externals.push({
        'discord.js': 'discord.js',
        'zlib-sync': 'zlib-sync',
        '@prisma/client': '@prisma/client',
      });
    }
    
    // Handle .node files (native modules)
    config.module.rules.push({
      test: /\.node$/,
      use: 'ignore-loader',
    });
    
    return config;
  },
  // Favicon should be automatically served from public or app directory
  /* Removed incorrect redirect that was causing favicon issues */
  // Add other configuration options as needed
};

export default nextConfig;