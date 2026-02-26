import withPWA from 'next-pwa';
import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

const pwa = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: isDev,
});

export default pwa(nextConfig as any); // ✅ FIX