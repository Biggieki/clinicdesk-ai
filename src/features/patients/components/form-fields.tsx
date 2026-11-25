"use client";

import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";

interface FieldMeta {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

interface FieldShellProps extends FieldMeta {
  id: string;
  children: ReactNode;
}

function FieldShell({ id, label, error, hint, required, children }: FieldShellProps) {
  return (
    <div className="field">
      <label htmlFor={id} className="field-label">
        {label}
        {required && <span className="field-required" aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && <p id={`${id}-hint`} className="field-hint">{hint}</p>}
      {error && <p id={`${id}-error`} className="field-error">{error}</p>}
    </div>
  );
}

/** ARIA wiring shared by every control: invalid state + hint/error descriptions. */
function controlProps(id: string, { error, hint, required }: FieldMeta) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ");
  return {
    id,
    className: "field-control",
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": describedBy || undefined,
    "aria-required": required ? (true as const) : undefined,
  };
}

type TextFieldProps = FieldMeta & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "required">;

export function TextField({ label, error, hint, required, ...input }: TextFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required}>
      <input {...controlProps(id, { label, error, hint, required })} {...input} />
    </FieldShell>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

type SelectFieldProps = FieldMeta &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "required"> & {
    options: readonly SelectOption[];
    placeholder?: string;
  };

export function SelectField({
  label, error, hint, required, options, placeholder, ...select
}: SelectFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required}>
      <select {...controlProps(id, { label, error, hint, required })} {...select}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </FieldShell>
  );
}
