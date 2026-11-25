import type { ValidationError } from "./types";

/**
 * English wording for validation codes: the ONLY place validation text lives.
 *
 * The `never` check in the default branch makes TypeScript fail the build if a
 * new ValidationErrorCode is added without a message. When languages are added,
 * this becomes one message table per language.
 */
export function getErrorMessage({ code, params }: ValidationError): string {
  switch (code) {
    case "fullName.required":
      return "Enter the patient's full name.";
    case "fullName.tooShort":
      return `Full name must be at least ${params?.min ?? 2} characters.`;
    case "fullName.tooLong":
      return `Full name must be ${params?.max ?? 100} characters or fewer.`;
    case "fullName.invalidChars":
      return "Full name can only contain letters, spaces, hyphens, apostrophes and full stops.";
    case "phone.required":
      return "Enter a phone number.";
    case "phone.invalidChars":
      return "Use only digits, spaces, +, -, ( and ).";
    case "phone.length":
      return `A phone number needs between ${params?.min ?? 7} and ${params?.max ?? 15} digits.`;
    case "gender.required":
      return "Select a gender option.";
    case "dateOfBirth.required":
      return "Enter the date of birth.";
    case "dateOfBirth.invalid":
      return "Enter a valid date.";
    case "dateOfBirth.future":
      return "Date of birth cannot be in the future.";
    case "dateOfBirth.tooOld":
      return `Check the year: this would make the patient over ${params?.max ?? 130}.`;
    case "email.invalid":
      return "Enter a valid email address, like name@example.com.";
    default: {
      const unhandled: never = code;
      return unhandled;
    }
  }
}
