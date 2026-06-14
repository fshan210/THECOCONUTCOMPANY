/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"]
  },
  async redirects() {
    return [
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
