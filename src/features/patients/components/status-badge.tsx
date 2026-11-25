import { STATUS_LABELS, type PatientStatus } from "../types";

/** Reuses the dashboard's `.status` pill; the active/inactive colours live in patients.css. */
export function StatusBadge({ status }: { status: PatientStatus }) {
  return (
    <span className={`status ${status}`}>
      <i /> {STATUS_LABELS[status]}
    </span>
  );
}
