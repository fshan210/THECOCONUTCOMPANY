import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const supabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const isAccountRoute = request.nextUrl.pathname.startsWith("/account");
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isAdminAuthRoute = request.nextUrl.pathname === "/admin/login" || request.nextUrl.pathname === "/admin/forgot-password";

  if (isAdminRoute && !isAdminAuthRoute) {
    const hasAdminSession = Boolean(request.cookies.get("co-admin-session")?.value);
    if (!hasAdminSession) {
      const adminLoginUrl = request.nextUrl.clone();
      adminLoginUrl.pathname = "/admin/login";
      adminLoginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(adminLoginUrl);
    }
  }

  if (!supabaseConfigured || !isAccountRoute) {
    return NextResponse.next();
  }

  const hasSupabaseSession = request.cookies.getAll().some((cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("auth-token"));

  if (hasSupabaseSession) {
    return NextResponse.next();
  }

  const signInUrl = request.nextUrl.clone();
  signInUrl.pathname = "/sign-in";
  signInUrl.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"]
};
