import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";
import { hasPermission, type Permission } from "@/lib/permissions";
import type { Role } from "@/generated/prisma/enums";

const { auth } = NextAuth(authConfig);

const routePermissions: Array<{ prefix: string; permission: Permission }> = [
  { prefix: "/admin/users", permission: "MANAGE_USERS" },
  { prefix: "/admin/leads", permission: "VIEW_LEADS" },
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/admin/login";
  const session = req.auth;
  const isLoggedIn = Boolean(session?.user?.id);

  if (!isLoggedIn && !isLogin) {
    const url = new URL("/admin/login", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (isLoggedIn && isLogin) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }

  const totpEnabled = Boolean(
    (session?.user as { totpEnabled?: boolean } | undefined)?.totpEnabled,
  );
  const role = (session?.user as { role?: Role } | undefined)?.role;

  if (isLoggedIn && !totpEnabled && pathname !== "/admin/setup-2fa") {
    return NextResponse.redirect(new URL("/admin/setup-2fa", req.nextUrl.origin));
  }

  if (isLoggedIn && totpEnabled && pathname === "/admin/setup-2fa") {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }

  if (isLoggedIn && role) {
    for (const rule of routePermissions) {
      if (pathname.startsWith(rule.prefix)) {
        if (!hasPermission(role, rule.permission)) {
          return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
        }
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
