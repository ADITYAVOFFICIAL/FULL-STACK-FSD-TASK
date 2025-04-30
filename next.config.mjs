/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignores lint errors during builds
  },
  typescript: {
    ignoreBuildErrors: true, // Ignores TS errors during builds (use cautiously)
  },
  images: {
    unoptimized: true, // Useful when deploying to non-Next.js optimized platforms
  },
}
