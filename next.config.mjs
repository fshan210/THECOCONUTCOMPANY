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
    formats: ["image/avif", "image/webp"]
  },
  async redirects() {
    return [
      {
        source: "/products",
        destination: "/shop",
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
