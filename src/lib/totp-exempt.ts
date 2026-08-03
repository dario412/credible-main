/** Users who can sign in without two-factor authentication. */
const TOTP_EXEMPT_EMAILS = new Set(["lloyd@crediblecreators.com"]);

export function isTotpExempt(email: string | null | undefined) {
  if (!email) return false;
  return TOTP_EXEMPT_EMAILS.has(email.trim().toLowerCase());
}
