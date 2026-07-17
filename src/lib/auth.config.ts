import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      if (!pathname.startsWith("/admin")) return true;
      if (pathname === "/admin/login") return true;
      return Boolean(auth?.user);
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const u = user as {
          id?: string;
          role?: string;
          totpEnabled?: boolean;
          email?: string | null;
          name?: string | null;
        };
        token.id = u.id;
        token.role = u.role as "OWNER" | "EDITOR" | "VIEWER" | undefined;
        token.totpEnabled = u.totpEnabled;
        token.email = u.email;
        token.name = u.name;
      }
      if (trigger === "update" && session) {
        if (typeof session.totpEnabled === "boolean") {
          token.totpEnabled = session.totpEnabled;
        }
        if (session.role) {
          token.role = session.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: (token.email as string) ?? "",
          name: token.name as string | null | undefined,
          role: token.role as "OWNER" | "EDITOR" | "VIEWER",
          totpEnabled: Boolean(token.totpEnabled),
        };
      }
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
