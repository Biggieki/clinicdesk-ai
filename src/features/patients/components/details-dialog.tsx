"use client";

import type { ReactNode } from "react";
import type { ClinicSettings } from "@/lib/tenant/current-clinic";
import { GENDER_LABELS, type Patient } from "../types";
import { calculateAge, formatDate, formatTimestamp, todayInTimeZone } from "../utils";
import { Dialog } from "./dialog";
import { StatusBadge } from "./status-badge";

function Detail({ label, children }: { label: string; children?: ReactNode }) {
  return (
    <div className="detail-row">
      <dt>{label}</dt>
      <dd>{children || <span className="not-provided">Not provided</span>}</dd>
    </div>
  );
}

interface DetailsDialogProps {
  /** null = closed. Date-dependent values (age) are only computed while open. */
  patient: Patient | null;
  settings: ClinicSettings;
  onClose: () => void;
}

export function DetailsDialog({ patient, settings, onClose }: DetailsDialogProps) {
  const age = patient
    ? calculateAge(patient.dateOfBirth, todayInTimeZone(settings.timeZone))
    : null;

  return (
    <Dialog open={patient !== null} title={patient?.fullName ?? "Patient details"} onClose={onClose}>
      {patient && (
        <dl className="detail-list">
          <Detail label="Patient ID">{patient.patientNumber}</Detail>
          <Detail label="Status"><StatusBadge status={patient.status} /></Detail>
          <Detail label="Gender">{GENDER_LABELS[patient.gender]}</Detail>
          <Detail label="Date of birth">
            {formatDate(patient.dateOfBirth, settings)}
            {age !== null && ` (${age} years old)`}
          </Detail>
          <Detail label="Phone number">{patient.phone}</Detail>
          <Detail label="Email">{patient.email}</Detail>
          <Detail label="Date registered">{formatTimestamp(patient.registeredAt, settings)}</Detail>
        </dl>
      )}
      <div className="dialog-actions">
        <button type="button" className="btn-secondary" onClick={onClose}>Close</button>
      </div>
    </Dialog>
  );
}
