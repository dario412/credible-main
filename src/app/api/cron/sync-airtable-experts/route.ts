import { syncExpertsFromAirtable } from "@/lib/airtable/sync-experts";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Secured cron endpoint for roster sync.
 * Authorization: Bearer CRON_SECRET
 */
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return Response.json(
      { ok: false, message: "CRON_SECRET is not configured." },
      { status: 503 },
    );
  }

  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token || token !== secret) {
    return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const result = await syncExpertsFromAirtable();
  return Response.json(result, { status: result.ok ? 200 : 502 });
}
