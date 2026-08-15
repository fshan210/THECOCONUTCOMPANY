/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  serverExternalPackages: [
    "firebase-admin",
    "firebase-admin/app",
    "firebase-admin/auth",
    "firebase-admin/firestore",
    "jwks-rsa",
    "jose"
  ],
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.cothecoconutcompany.com",
        pathname: "/site-media/v1/**"
      }
    ]
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
    ];
    const immutableHeaders = [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable"
      }
    ];
    return [
      {
        source: "/:path*",
        headers: securityHeaders
      },
      {
        source: "/assets-optimized/:path*",
        headers: immutableHeaders
      },
      { source: "/assets/video/homepage-v2/:path*", headers: immutableHeaders },
      { source: "/assets/products/transparent-current/:path*", headers: immutableHeaders },
      { source: "/assets/home/generated/:path*", headers: immutableHeaders },
      { source: "/assets/home/co-hero-coconut-transparent-v1.webp", headers: immutableHeaders },
      { source: "/assets/backgrounds/water-material/co-coconut-water-material.png", headers: immutableHeaders },
      { source: "/assets/backgrounds/day-with-co/midday-kitchen.png", headers: immutableHeaders }
    ];
  },
  async redirects() {
    return [
      {
        source: "/products",
        destination: "/shop",
        permanent: true
      },
      {
        source: "/sign-in",
        destination: "/login",
        permanent: true
      },
      {
        source: "/sign-up",
        destination: "/register",
        permanent: true
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.cothecoconutcompany.com"
          }
        ],
        destination: "https://cothecoconutcompany.com/:path*",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
