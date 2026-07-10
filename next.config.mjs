/** @type {import('next').NextConfig} */
const nextConfig = {
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
    qualities: [75, 90, 95]
  },
  async headers() {
    return [
      {
        source: "/assets-optimized/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      }
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
