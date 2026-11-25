import type { ClinicSettings } from "@/lib/tenant/current-clinic";
import type { Patient, PatientFormValues } from "./types";

/** Prefix of the human-friendly Patient ID. Will become a per-clinic setting. */
export const PATIENT_NUMBER_PREFIX = "CD";

/** First letter of the first and last word: "Hodan Warsame" -> "HW". */
export function getInitials(fullName: string): string {
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  const first = words[0].charAt(0);
  const last = words.length > 1 ? words[words.length - 1].charAt(0) : "";
  return `${first}${last}`.toUpperCase();
}

// ---------------------------------------------------------------------------
// Dates and time zones
//
// Two different kinds of "date" exist here, and mixing them up causes
// off-by-one-day bugs:
//   * a CALENDAR DATE (date of birth, "1990-05-05") is the same everywhere,
//     so it is formatted in UTC and never shifted by a time zone;
//   * a MOMENT (registeredAt, an ISO UTC timestamp) happened at one instant
//     and is shown as the date in the CLINIC's time zone.
// Neither function hard-codes a locale: the clinic's settings decide.
// ---------------------------------------------------------------------------

type DateSettings = Pick<ClinicSettings, "locale" | "dateFormat">;

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getDateFormatter(locale: string, timeZone: string, dateStyle: ClinicSettings["dateFormat"]) {
  const key = `${locale}|${timeZone}|${dateStyle}`;
  let formatter = formatterCache.get(key);
  if (!formatter) {
    try {
      formatter = new Intl.DateTimeFormat(locale, { dateStyle, timeZone });
    } catch {
      // A mistyped locale or time zone in settings must not crash the page.
      formatter = new Intl.DateTimeFormat("en-US", { dateStyle, timeZone: "UTC" });
    }
    formatterCache.set(key, formatter);
  }
  return formatter;
}

/** Formats a calendar date (YYYY-MM-DD), e.g. a date of birth. Time zone never shifts it. */
export function formatDate(calendarDate: string, settings: DateSettings): string {
  const date = new Date(`${calendarDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return calendarDate;
  return getDateFormatter(settings.locale, "UTC", settings.dateFormat).format(date);
}

/** Formats a moment (ISO UTC timestamp) as a date in the clinic's time zone. */
export function formatTimestamp(timestamp: string, settings: ClinicSettings): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return getDateFormatter(settings.locale, settings.timeZone, settings.dateFormat).format(date);
}

/** Today's calendar date (YYYY-MM-DD) as it is right now in the given time zone. */
export function todayInTimeZone(timeZone: string, now: Date = new Date()): string {
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat("en-US", {
      timeZone, year: "numeric", month: "2-digit", day: "2-digit",
    }).formatToParts(now);
  } catch {
    return now.toISOString().slice(0, 10); // invalid time zone: fall back to UTC
  }
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/** Age in whole years on `today`. Both arguments are YYYY-MM-DD calendar dates. */
export function calculateAge(dateOfBirth: string, today: string): number | null {
  const dob = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateOfBirth);
  const now = /^(\d{4})-(\d{2})-(\d{2})$/.exec(today);
  if (!dob || !now) return null;
  let age = Number(now[1]) - Number(dob[1]);
  if (`${now[2]}${now[3]}` < `${dob[2]}${dob[3]}`) age -= 1; // birthday not reached yet this year
  return age >= 0 ? age : null;
}

// ---------------------------------------------------------------------------
// Identifiers
// ---------------------------------------------------------------------------

/** Random UUID for a new record's opaque `id`. Call from event handlers, not during render. */
export function createId(): string {
  const webCrypto = globalThis.crypto;
  if (typeof webCrypto?.randomUUID === "function") return webCrypto.randomUUID();

  // randomUUID only exists in secure contexts (https / localhost). Fallback for
  // e.g. testing over plain http on a LAN address.
  const bytes = new Uint8Array(16);
  webCrypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // RFC 4122 variant
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * Next Patient ID for ONE clinic, e.g. "CD-1011".
 * Pass only that clinic's patients: each clinic has its own sequence.
 */
export function nextPatientNumber(clinicPatients: readonly Patient[]): string {
  const highest = clinicPatients.reduce((max, patient) => {
    const match = /(\d+)$/.exec(patient.patientNumber);
    const n = match ? Number(match[1]) : NaN;
    return Number.isFinite(n) && n > max ? n : max;
  }, 1000);
  return `${PATIENT_NUMBER_PREFIX}-${highest + 1}`;
}

// ---------------------------------------------------------------------------
// Search and form helpers
// ---------------------------------------------------------------------------

const digitsOnly = (value: string) => value.replace(/\D/g, "");

/**
 * Search by name, phone number or Patient ID.
 *
 * Every word typed must match something. Words match the name / Patient ID
 * text ("ahm", "mohamed ahmed", "cd-1006") or the phone's digits, ignoring
 * spaces, dashes and brackets, so "5550108" finds "+000 555 0108".
 * The internal opaque `id` is deliberately not searchable.
 */
export function matchesQuery(patient: Patient, query: string): boolean {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;

  const text = `${patient.fullName} ${patient.patientNumber}`.toLowerCase();
  const phoneDigits = digitsOnly(patient.phone);

  return words.every((word) => {
    if (text.includes(word)) return true;
    const wordDigits = digitsOnly(word);
    return wordDigits.length > 0 && phoneDigits.includes(wordDigits);
  });
}

/** Drops system-assigned fields to get editable form state. */
export function patientToFormValues(patient: Patient): PatientFormValues {
  return {
    fullName: patient.fullName,
    phone: patient.phone,
    gender: patient.gender,
    dateOfBirth: patient.dateOfBirth,
    email: patient.email,
    status: patient.status,
  };
}
