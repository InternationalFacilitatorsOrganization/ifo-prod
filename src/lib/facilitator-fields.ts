/**
 * Allowlisted column names for the Facilitators table.
 * Used in API routes to prevent SQL injection via crafted key names.
 * Must be kept in sync with the schema in db/config.ts.
 */
export const FACILITATOR_COLUMNS = new Set([
  "id",
  "createdDate",
  "updatedDate",
  "firstName",
  "lastName",
  "email",
  "languages",
  "country",
  "timeZone",
  "location",
  "website",
  "yearsOfExperience",
  "areasOfExpertise",
  "certifications",
  "fees",
  "programOffered",
  "clientList",
  "status",
  "bio",
  "photo",
]);

/** Columns that are never writable via the API (managed server-side). */
const READONLY_COLUMNS = new Set(["id", "createdDate", "updatedDate", "photo"]);

/**
 * Filter an object's keys to only valid, writable Facilitator columns.
 * Returns a new object containing only safe key/value pairs.
 */
export function sanitizeFields(
  data: Record<string, unknown>
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const key of Object.keys(data)) {
    if (FACILITATOR_COLUMNS.has(key) && !READONLY_COLUMNS.has(key)) {
      sanitized[key] = data[key];
    }
  }
  return sanitized;
}
