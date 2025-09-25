module.exports = {
  eslint: {
    // Temporarily disable ESLint during build to test TypeScript compilation
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    return config;
  },
};