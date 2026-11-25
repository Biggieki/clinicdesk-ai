"use client";

import { useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react";
import {
  GENDERS,
  GENDER_LABELS,
  PATIENT_STATUSES,
  STATUS_LABELS,
  type PatientFormErrors,
  type PatientFormValues,
  type PatientInput,
} from "../types";
import { todayInTimeZone } from "../utils";
import { parsePatientForm } from "../validation";
import { getErrorMessage } from "../validation-messages";
import { SelectField, TextField } from "./form-fields";

interface PatientFormProps {
  mode: "create" | "edit";
  /** Starting values. "Reset" returns the form to exactly these. */
  initialValues: PatientFormValues;
  /** IANA time zone of the clinic: decides what "today" means for the date-of-birth check. */
  timeZone: string;
  onSubmit: (data: PatientInput) => void;
  onClose: () => void;
}

type ChangeTarget = HTMLInputElement | HTMLSelectElement;

const GENDER_OPTIONS = GENDERS.map((value) => ({ value, label: GENDER_LABELS[value] }));
const STATUS_OPTIONS = PATIENT_STATUSES.map((value) => ({ value, label: STATUS_LABELS[value] }));

/**
 * One form for adding and editing a patient.
 *
 * Validation timing: a field is checked when the user leaves it (blur); once
 * an error is showing it re-checks on every keystroke so it clears as soon as
 * it's fixed; and everything is checked on submit. The first invalid field is
 * focused so keyboard and screen-reader users land on the problem.
 */
export function PatientForm({ mode, initialValues, timeZone, onSubmit, onClose }: PatientFormProps) {
  const [values, setValues] = useState<PatientFormValues>(initialValues);
  const [errors, setErrors] = useState<PatientFormErrors>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleChange(field: keyof PatientFormValues, event: ChangeEvent<ChangeTarget>) {
    const next = { ...values, [field]: event.target.value } as PatientFormValues;
    setValues(next);

    if (submitAttempted || errors[field]) {
      const result = parsePatientForm(next, todayInTimeZone(timeZone));
      setErrors((current) => ({
        ...current,
        [field]: result.success ? undefined : result.errors[field],
      }));
    }
  }

  function handleBlur(field: keyof PatientFormValues) {
    const result = parsePatientForm(values, todayInTimeZone(timeZone));
    setErrors((current) => ({
      ...current,
      [field]: result.success ? undefined : result.errors[field],
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitAttempted(true);

    const result = parsePatientForm(values, todayInTimeZone(timeZone));
    if (!result.success) {
      setErrors(result.errors);
      // Wait for React to render aria-invalid, then move focus to the first problem.
      requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      });
      return;
    }

    setErrors({});
    onSubmit(result.data);
  }

  function handleReset() {
    setValues(initialValues);
    setErrors({});
    setSubmitAttempted(false);
    formRef.current?.querySelector<HTMLElement>("input")?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    }
  }

  /** Props every field needs, so each field below stays one line. */
  const bind = (field: keyof PatientFormValues) => ({
    name: field,
    value: values[field],
    error: errors[field] ? getErrorMessage(errors[field]) : undefined,
    onChange: (event: ChangeEvent<ChangeTarget>) => handleChange(field, event),
    onBlur: () => handleBlur(field),
  });

  const errorCount = Object.values(errors).filter(Boolean).length;
  const title = mode === "create" ? "Add patient" : "Edit patient";

  return (
    <section className="panel patient-form-panel" aria-labelledby="patient-form-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{mode === "create" ? "NEW RECORD" : "EDIT RECORD"}</p>
          <h3 id="patient-form-title">{title}</h3>
          <p className="panel-subtitle">Fields marked * are required. Use fictional details only while testing.</p>
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} onKeyDown={handleKeyDown} noValidate>
        {submitAttempted && errorCount > 0 && (
          <div className="form-alert" role="alert">
            Please correct the {errorCount} highlighted {errorCount === 1 ? "field" : "fields"} below.
          </div>
        )}

        <div className="form-grid">
          <div className="form-span-2">
            <TextField label="Full name" required autoFocus autoComplete="off" maxLength={100} {...bind("fullName")} />
          </div>
          <TextField
            label="Phone number" required type="tel" inputMode="tel" autoComplete="off"
            hint="Include the country code." {...bind("phone")}
          />
          <SelectField label="Gender" required placeholder="Select…" options={GENDER_OPTIONS} {...bind("gender")} />
          <TextField label="Date of birth" required type="date" {...bind("dateOfBirth")} />
          <TextField
            label="Email" type="email" inputMode="email" autoComplete="off" maxLength={254}
            hint="Optional." {...bind("email")}
          />
          {mode === "edit" && (
            <SelectField label="Record status" options={STATUS_OPTIONS} {...bind("status")} />
          )}
        </div>

        <div className="form-actions">
          <p className="form-legend"><span aria-hidden="true">*</span> Required</p>
          <button type="button" className="btn-secondary" onClick={handleReset}>Reset</button>
          <button type="button" className="btn-secondary" onClick={onClose}>Close</button>
          <button type="submit" className="primary-button">
            {mode === "create" ? "Add patient" : "Save changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
