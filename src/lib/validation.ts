/**
 * Shared server-side input validation for public form endpoints.
 *
 * Every value that reaches an email template, the Payload DB, Google Sheets or
 * Teams must pass through here first. The frontend does its own validation for
 * UX, but none of it is trusted — these limits are enforced again server-side.
 */

/** Maximum accepted length per field, in characters, before truncation. */
export const FIELD_LIMITS = {
  name: 120,
  email: 254, // RFC 5321 maximum
  phone: 40,
  website: 300,
  company: 160,
  goal: 80,
  stage: 80,
  budget: 80,
  need: 120,
  role: 120,
  linkedin: 300,
  message: 5000,
  why: 5000,
  sourcePage: 300,
  utmSource: 150,
  utmMedium: 150,
  utmCampaign: 200,
} as const

export type FieldName = keyof typeof FIELD_LIMITS

/** Fallback cap for any field not named in FIELD_LIMITS. */
const DEFAULT_LIMIT = 500

/**
 * Coerce an unknown JSON value to a trimmed, length-capped string.
 * Strips control characters (including NUL and newlines in short fields are
 * kept — only C0/C1 controls other than tab/newline are removed).
 */
export function cleanField(value: unknown, field?: FieldName): string {
  if (typeof value !== 'string') return ''
  const limit = field ? FIELD_LIMITS[field] : DEFAULT_LIMIT
  return value
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, limit)
}

/**
 * Validate an email address well enough to decide whether we are willing to
 * send mail to it. Deliberately stricter than the previous /\S+@\S+\.\S+/:
 * no whitespace, no commas/semicolons (header injection), exactly one @,
 * and a TLD of at least two characters.
 */
const EMAIL_RE = /^[^\s@,;:<>"'\\]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/

export function isValidEmail(email: string): boolean {
  if (!email || email.length > FIELD_LIMITS.email) return false
  // CR/LF in a recipient address is an SMTP header-injection attempt.
  if (/[\r\n]/.test(email)) return false
  if ((email.match(/@/g) || []).length !== 1) return false
  if (email.includes('..')) return false
  return EMAIL_RE.test(email)
}

/**
 * Normalise a submitted body into a flat record of cleaned strings.
 * Unknown keys are dropped so a caller cannot smuggle extra fields into the
 * email templates or the Payload create() call.
 */
export function cleanBody(
  raw: unknown,
  fields: readonly FieldName[]
): Record<string, string> {
  const src = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const out: Record<string, string> = {}
  for (const f of fields) out[f] = cleanField(src[f], f)
  return out
}
