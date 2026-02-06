/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Next.js uses inline scripts for hydration and JSON-LD in this app; keep 'unsafe-inline' for safety/simplicity.
  // In development, Next may require eval; restrict in production.
  `script-src 'self' 'unsafe-inline' ${isProd ? '' : "'unsafe-eval'"} https://js.stripe.com`,
  "connect-src 'self' https://api.stripe.com https://*.stripe.com https://raw.githack.com",
  // Allow embedded Google Maps on the Contact page.
  "frame-src https://js.stripe.com https://checkout.stripe.com https://www.google.com https://maps.google.com",
  "form-action 'self' https://checkout.stripe.com",
  'upgrade-insecure-requests',
].join('; ')

const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    unoptimized: false,
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp.replace(/\s{2,}/g, ' ').trim() },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig

