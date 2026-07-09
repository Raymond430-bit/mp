/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.coingecko.com' },
      { protocol: 'https', hostname: '**.cryptocompare.com' },
    ],
  },
};

module.exports = nextConfig;
