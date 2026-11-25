import type {
  PatientFormErrors,
  PatientFormValues,
  PatientInput,
  ValidationError,
} from "./types";

export type ParseResult =
  | { success: true; data: PatientInput }
  | { success: false; errors: PatientFormErrors };

// \p{L} = any letter in any script, \p{M} = combining marks, so Somali, Turkish
// and Arabic names validate as well as English ones.
const NAME_PATTERN = /^[\p{L}][\p{L}\p{M}'’.\- ]*$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9\s().-]+$/;

const NAME_LIMITS = { min: 2, max: 100 };
const PHONE_LIMITS = { min: 7, max: 15 };
const MAX_AGE_YEARS = 130;

function validateFullName(value: string): ValidationError | undefined {
  if (!value) return { code: "fullName.required" };
  if (value.length < NAME_LIMITS.min) return { code: "fullName.tooShort", params: { min: NAME_LIMITS.min } };
  if (value.length > NAME_LIMITS.max) return { code: "fullName.tooLong", params: { max: NAME_LIMITS.max } };
  if (!NAME_PATTERN.test(value)) return { code: "fullName.invalidChars" };
  return undefined;
}

function validatePhone(value: string): ValidationError | undefined {
  if (!value) return { code: "phone.required" };
  if (!PHONE_PATTERN.test(value)) return { code: "phone.invalidChars" };
  const digits = value.replace(/\D/g, "").length;
  if (digits < PHONE_LIMITS.min || digits > PHONE_LIMITS.max) {
    return { code: "phone.length", params: PHONE_LIMITS };
  }
  return undefined;
}

function validateDateOfBirth(value: string, today: string): ValidationError | undefined {
  if (!value) return { code: "dateOfBirth.required" };
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return { code: "dateOfBirth.invalid" };
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(Date.UTC(year, month - 1, day));
  const isRealDate =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;
  if (!isRealDate) return { code: "dateOfBirth.invalid" };
  if (value > today) return { code: "dateOfBirth.future" };
  if (year < Number(today.slice(0, 4)) - MAX_AGE_YEARS) {
    return { code: "dateOfBirth.tooOld", params: { max: MAX_AGE_YEARS } };
  }
  return undefined;
}

/**
 * Validates and normalises the patient form.
 *
 * Required: full name, phone number, gender, date of birth.
 * Optional: email (validated only when something is typed).
 *
 * Problems come back as codes (see ValidationErrorCode), never as English
 * text. `today` (YYYY-MM-DD, in the clinic's time zone) is passed in so this
 * function stays pure and testable.
 *
 * IMPORTANT: this is user-experience validation only. Anything that reaches a
 * real database must be validated again on the server and protected by
 * Row Level Security, because client-side checks can be bypassed.
 */
export function parsePatientForm(values: PatientFormValues, today: string): ParseResult {
  const fullName = values.fullName.trim().replace(/\s+/g, " ");
  const phone = values.phone.trim();
  const dateOfBirth = values.dateOfBirth.trim();
  const email = values.email.trim().toLowerCase();

  const errors: PatientFormErrors = {};
  const set = (field: keyof PatientFormValues, error: ValidationError | undefined) => {
    if (error) errors[field] = error;
  };

  set("fullName", validateFullName(fullName));
  set("phone", validatePhone(phone));
  if (values.gender === "") set("gender", { code: "gender.required" });
  set("dateOfBirth", validateDateOfBirth(dateOfBirth, today));
  if (email && (email.length > 254 || !EMAIL_PATTERN.test(email))) {
    set("email", { code: "email.invalid" });
  }

  if (Object.keys(errors).length > 0 || values.gender === "") {
    return { success: false, errors };
  }

  return {
    success: true,
    data: { fullName, phone, gender: values.gender, dateOfBirth, email, status: values.status },
  };
}
