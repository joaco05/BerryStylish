/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    resolveAlias: {
      // Polyfill stubs for Solana/Metaplex browser compatibility
      crypto: { browser: "crypto-browserify" },
      stream: { browser: "stream-browserify" },
      buffer: { browser: "buffer" },
      http: { browser: "stream-http" },
      https: { browser: "https-browserify" },
      zlib: { browser: "browserify-zlib" },
      url: { browser: "url" },
    },
  },
}

export default nextConfig
