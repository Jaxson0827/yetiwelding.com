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
  `script-src 'self' 'unsafe-inline' ${isProd ? '' : "'unsafe-eval'"} https://js.stripe.com https://www.googletagmanager.com https://challenges.cloudflare.com`,
  "connect-src 'self' https://api.stripe.com https://*.stripe.com https://raw.githack.com https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com https://challenges.cloudflare.com",
  // Allow embedded Google Maps on the Contact page. Cloudflare Turnstile (contact + blog newsletter).
  "frame-src https://js.stripe.com https://checkout.stripe.com https://www.google.com https://maps.google.com https://challenges.cloudflare.com https://www.youtube.com https://www.youtube-nocookie.com",
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
  async redirects() {
    return [
      {
        source: '/home',
        destination: 'https://yetiwelding.com/',
        permanent: true,
      },
      {
        source: '/gallery',
        destination: 'https://yetiwelding.com/projects',
        permanent: true,
      },
      // Retired Yeti Steel Goods storefront. ':path*' makes the trailing
      // segments optional, so this covers the bare '/shop' too.
      {
        source: '/shop/:path*',
        destination: '/order',
        permanent: true,
      },
    ]
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

