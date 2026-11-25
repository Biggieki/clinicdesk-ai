import type { ClinicSettings } from "@/lib/tenant/current-clinic";
import { GENDER_LABELS, type Patient } from "../types";
import { formatTimestamp, getInitials } from "../utils";
import { StatusBadge } from "./status-badge";

interface PatientTableProps {
  patients: readonly Patient[];
  settings: ClinicSettings;
  onView: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

/**
 * A real <table>, so assistive tech announces rows and column headers.
 *
 * On narrow screens CSS turns each row into a stacked card (see patients.css).
 * Changing `display` can strip native table semantics in some browsers, so the
 * ARIA roles are written out explicitly to keep them intact, and each cell
 * carries a data-label that CSS shows as the card's field label.
 */
export function PatientTable({ patients, settings, onView, onEdit, onDelete }: PatientTableProps) {
  return (
    <div className="table-wrap">
      <table className="patient-table" role="table">
        <caption className="visually-hidden">Patient records</caption>
        <thead role="rowgroup">
          <tr role="row">
            <th scope="col" role="columnheader">Patient ID</th>
            <th scope="col" role="columnheader">Full name</th>
            <th scope="col" role="columnheader">Phone number</th>
            <th scope="col" role="columnheader">Gender</th>
            <th scope="col" role="columnheader">Date registered</th>
            <th scope="col" role="columnheader">Status</th>
            <th scope="col" role="columnheader">Actions</th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {patients.map((patient) => (
            <tr key={patient.id} role="row">
              <td role="cell" data-label="Patient ID" className="cell-id">{patient.patientNumber}</td>
              <th scope="row" role="rowheader" className="cell-name">
                <span className="name-cell">
                  <span className="avatar patient-avatar" aria-hidden="true">
                    {getInitials(patient.fullName)}
                  </span>
                  <span className="patient-name">{patient.fullName}</span>
                </span>
              </th>
              <td role="cell" data-label="Phone number">{patient.phone}</td>
              <td role="cell" data-label="Gender">{GENDER_LABELS[patient.gender]}</td>
              <td role="cell" data-label="Date registered">{formatTimestamp(patient.registeredAt, settings)}</td>
              <td role="cell" data-label="Status"><StatusBadge status={patient.status} /></td>
              <td role="cell" data-label="Actions" className="cell-actions">
                <div className="row-actions">
                  <button type="button" className="row-action" onClick={() => onView(patient)} aria-label={`View ${patient.fullName}`}>
                    View
                  </button>
                  <button type="button" className="row-action" onClick={() => onEdit(patient)} aria-label={`Edit ${patient.fullName}`}>
                    Edit
                  </button>
                  <button type="button" className="row-action row-action-danger" onClick={() => onDelete(patient)} aria-label={`Delete ${patient.fullName}`}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
