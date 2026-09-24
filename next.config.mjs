/** @type {import('next').NextConfig} */
const isVercelNonProduction = Boolean(process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production");
const isVercelProduction = process.env.VERCEL_ENV === "production";

function configuredOrigin(value) {
  if (!value) return null;
  try { return new URL(value).origin; } catch { return null; }
}

const configuredConnectOrigins = [
  configuredOrigin(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  configuredOrigin(process.env.NEXT_PUBLIC_SUPABASE_URL),
  configuredOrigin(process.env.NEXT_PUBLIC_DOTCO_API_BASE_URL),
  configuredOrigin(process.env.NEXT_PUBLIC_MEDIA_BASE_URL)
].filter(Boolean);

const cspReportOnly = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.clarity.ms https://www.google.com https://www.gstatic.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://media.cothecoconutcompany.com https://www.google-analytics.com https://www.googletagmanager.com https://*.clarity.ms",
  "font-src 'self' data:",
  ["connect-src 'self'", "https://media.cothecoconutcompany.com", "https://www.google-analytics.com", "https://*.google-analytics.com", "https://*.clarity.ms", "https://identitytoolkit.googleapis.com", "https://securetoken.googleapis.com", "https://firestore.googleapis.com", ...configuredConnectOrigins].join(" "),
  "media-src 'self' blob: https://media.cothecoconutcompany.com",
  "frame-src 'self' https://www.google.com https://recaptcha.google.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'"
].join("; " );

const nextConfig = {
  env: {
    NEXT_PUBLIC_FIREBASE_DEPLOYMENT_ENV: process.env.VERCEL_ENV || "development"
  },
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
    qualities: [75, 90, 92, 95, 100],
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
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Content-Security-Policy-Report-Only", value: cspReportOnly }
    ];
    if (isVercelProduction) securityHeaders.push({ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" });
    const immutableHeaders = [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable"
      }
    ];
    return [
      ...(isVercelNonProduction
        ? [{
            source: "/:path*",
            headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }]
          }]
        : []),
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
        source: "/terms",
        destination: "/terms-and-conditions",
        permanent: true
      },
      {
        source: "/our-story",
        destination: "/about",
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
