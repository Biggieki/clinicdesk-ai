export const GENDERS = ["female", "male", "other", "undisclosed"] as const;
export type Gender = (typeof GENDERS)[number];

export const GENDER_LABELS: Record<Gender, string> = {
  female: "Female",
  male: "Male",
  other: "Other",
  undisclosed: "Prefer not to say",
};

export const PATIENT_STATUSES = ["active", "inactive"] as const;
export type PatientStatus = (typeof PATIENT_STATUSES)[number];

export const STATUS_LABELS: Record<PatientStatus, string> = {
  active: "Active",
  inactive: "Inactive",
};

/** Everything a staff member types in about a patient (after validation). */
export interface PatientInput {
  fullName: string;
  phone: string;
  gender: Gender;
  /** Calendar date, YYYY-MM-DD. A birthday is a date, not a moment, so it has no time zone. */
  dateOfBirth: string;
  /** Optional: empty string when not provided. */
  email: string;
  status: PatientStatus;
}

/** A stored patient: user input plus fields the system assigns. */
export interface Patient extends PatientInput {
  /**
   * Opaque unique identifier (UUID). Never shown to staff. This is the key for
   * React lists and, later, for URLs and the database primary key. Unlike a
   * sequential number it can't be guessed.
   */
  id: string;
  /** The clinic (tenant) that owns this record. Becomes clinic_id in the database. */
  clinicId: string;
  /** Human-friendly number shown as "Patient ID", e.g. "CD-1001". Unique within one clinic. */
  patientNumber: string;
  /** Moment of registration: ISO 8601 timestamp in UTC. Displayed in the clinic's time zone. */
  registeredAt: string;
}

/**
 * Raw form state. Identical to PatientInput except `gender` can be "" while
 * nothing is chosen yet. parsePatientForm() narrows it back to PatientInput.
 */
export type PatientFormValues = Omit<PatientInput, "gender"> & {
  gender: Gender | "";
};

/**
 * Validation problems are reported as codes (+ numbers), not English sentences.
 * The wording lives in validation-messages.ts, so translating later means
 * adding a message table, not rewriting validation logic.
 */
export type ValidationErrorCode =
  | "fullName.required"
  | "fullName.tooShort"
  | "fullName.tooLong"
  | "fullName.invalidChars"
  | "phone.required"
  | "phone.invalidChars"
  | "phone.length"
  | "gender.required"
  | "dateOfBirth.required"
  | "dateOfBirth.invalid"
  | "dateOfBirth.future"
  | "dateOfBirth.tooOld"
  | "email.invalid";

export interface ValidationError {
  code: ValidationErrorCode;
  params?: { min?: number; max?: number };
}

export type PatientFormErrors = Partial<Record<keyof PatientFormValues, ValidationError>>;

export const EMPTY_PATIENT_FORM: PatientFormValues = {
  fullName: "",
  phone: "",
  gender: "",
  dateOfBirth: "",
  email: "",
  status: "active",
};
