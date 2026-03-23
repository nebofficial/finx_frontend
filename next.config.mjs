/** @type {import('next').NextConfig} */
const backend =
  process.env.BACKEND_URL?.replace(/\/$/, '') || 'http://127.0.0.1:5000'

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  /**
   * Next.js rewrites use http-proxy with a default 30s timeout. Tenant provisioning
   * (create DB, sync schema, seed) often exceeds that — without raising this, the
   * browser sees ECONNRESET / 502 while the backend still completes successfully.
   */
  experimental: {
    proxyTimeout: 600_000,
  },
  /** Proxy API + uploads to the FinX backend (avoids browser CORS / ERR_NETWORK to :5000). */
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backend}/api/v1/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${backend}/uploads/:path*`,
      },
    ]
  },
}

export default nextConfig
