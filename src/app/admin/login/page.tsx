import { Suspense } from "react";
import { LoginFormInner } from "@/components/login-form";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Admin login",
  path: "/admin/login",
  noIndex: true,
});

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <LoginFormInner />
      </Suspense>
    </div>
  );
}
