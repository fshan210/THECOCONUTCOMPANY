import type { MetadataRoute } from "next";

const siteUrl = "https://cothecoconutcompany.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/account",
          "/orders",
          "/profile",
          "/wishlist",
          "/saved-recipes",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password"
        ]
      }
    ],
    sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/image-sitemap.xml`, `${siteUrl}/news-sitemap.xml`],
    host: siteUrl
  };
}
