/** @type {import('next').NextConfig} */
const nextConfig = {
  // Gera .next/standalone com um node_modules enxuto (imagem Docker menor)
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
