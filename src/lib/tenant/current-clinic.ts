/**
 * PLACEHOLDER for the active clinic (tenant).
 *
 * ClinicDesk AI is multi-tenant: every record belongs to exactly one clinic,
 * and a clinic must never see another clinic's data. There is no login or
 * database yet, so this file returns one fictional demo clinic.
 *
 * ┌ This is NOT a security boundary. ───────────────────────────────────────┐
 * │ Real isolation will come from the database (Postgres Row Level Security │
 * │ on a clinic_id column) and from resolving the clinic on the SERVER from  │
 * │ the signed-in user's membership. The authentication phase replaces       │
 * │ getCurrentClinic() with that lookup. Never trust a clinic ID sent by the │
 * │ browser or placed in a URL.                                              │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

export type DateFormatStyle = "short" | "medium" | "long";

/** Per-clinic regional settings. Formatting code reads these; it never hard-codes a locale. */
export interface ClinicSettings {
  /** BCP 47 language tag that decides number/date conventions, e.g. "en-US", "tr-TR", "ar". */
  locale: string;
  /** IANA time zone used to display moments in time, e.g. "Africa/Mogadishu". */
  timeZone: string;
  /** How long dates are written. The locale decides the order and wording. */
  dateFormat: DateFormatStyle;
}

export interface Clinic {
  /** Opaque tenant identifier. Becomes clinic_id in the database. */
  id: string;
  name: string;
  locationLabel: string;
  settings: ClinicSettings;
}

/** Fictional demo clinic. */
export const DEMO_CLINIC: Clinic = {
  id: "clinic_demo_001",
  name: "Central Clinic",
  locationLabel: "Hargeisa workspace",
  settings: {
    locale: "en-US",
    timeZone: "Africa/Mogadishu",
    dateFormat: "medium",
  },
};

/**
 * Returns the clinic the current user is working in.
 * Synchronous today. Once it reads the session it becomes async/dynamic and
 * callers will need a <Suspense> boundary (Next.js Cache Components rule).
 */
export function getCurrentClinic(): Clinic {
  return DEMO_CLINIC;
}
