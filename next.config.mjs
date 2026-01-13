/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/allthevibe-techconnect',
  assetPrefix: '/allthevibe-techconnect/',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
 
}

export default nextConfig