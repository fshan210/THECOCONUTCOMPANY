import { NextResponse, type NextRequest } from "next/server";
import { adminSessionCookie } from "@/lib/admin/auth-config";
import { getAdminPath, isConfiguredAdminPath, mapConfiguredAdminPath } from "@/lib/admin/path";
import { awsSessionCookie } from "@/lib/auth/aws-cookie";
import { launchPageSlugs } from "@/lib/launch-pages";

const publicTopLevelRoutes = new Set([
  "404", "about", "account", "api", "cart", "contact", "email-verified", "forgot-password", "founders",
  "journal", "login", "offline", "opengraph-image", "orders", "products", "profile", "recipes", "register", "reset-password",
  "ripple-debug", "saved-recipes", "shop", "sign-in", "sign-up", "status", "sustainability", "verify-email", "wishlist",
  ...launchPageSlugs,
]);

function isKnownPublicPath(pathname: string) {
  if (pathname === "/") return true;
  const topLevel = pathname.split("/").filter(Boolean)[0];
  return Boolean(topLevel && publicTopLevelRoutes.has(topLevel));
}

export function middleware(request: NextRequest) {
  const supabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const pathname = request.nextUrl.pathname;
  const adminPath = getAdminPath();
  const legacyAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const internalAdminRewrite = request.headers.get("x-co-admin-rewrite") === "1";
  const configuredAdminRoute = isConfiguredAdminPath(pathname);
  const mappedAdminPath = mapConfiguredAdminPath(pathname);
  const isAdminAuthRoute = mappedAdminPath === "/admin/login" || mappedAdminPath === "/admin/forgot-password";

  if (legacyAdminRoute && !internalAdminRewrite) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = pathname === "/admin" ? adminPath : pathname.replace("/admin", adminPath);
    return NextResponse.redirect(redirectUrl);
  }

  if (configuredAdminRoute) {
    if (!isAdminAuthRoute) {
      const hasAdminSession = Boolean(request.cookies.get(adminSessionCookie)?.value);
      if (!hasAdminSession) {
        const adminLoginUrl = request.nextUrl.clone();
        adminLoginUrl.pathname = `${adminPath}/login`;
        adminLoginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(adminLoginUrl);
      }
    }
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = mappedAdminPath;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-co-admin-rewrite", "1");
    return NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } });
  }

  const customerProtectedRoutes = ["/account", "/orders", "/wishlist", "/profile", "/saved-recipes"];
  const isCustomerProtectedRoute = customerProtectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (isCustomerProtectedRoute) {
    const hasCustomerSession = Boolean(request.cookies.get(awsSessionCookie)?.value);
    if (!hasCustomerSession) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const isLegacySupabaseAccountRoute = pathname.startsWith("/account");
  if (!isKnownPublicPath(pathname)) {
    const notFoundUrl = request.nextUrl.clone();
    notFoundUrl.pathname = "/404";
    return NextResponse.rewrite(notFoundUrl, { status: 404 });
  }

  if (!supabaseConfigured || !isLegacySupabaseAccountRoute) {
    return NextResponse.next();
  }

  const hasSupabaseSession = request.cookies.getAll().some((cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("auth-token"));

  if (hasSupabaseSession) {
    return NextResponse.next();
  }

  const signInUrl = request.nextUrl.clone();
  signInUrl.pathname = "/login";
  signInUrl.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"]
};
