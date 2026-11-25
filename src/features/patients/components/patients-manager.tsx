"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Clinic } from "@/lib/tenant/current-clinic";
import { usePatients } from "../use-patients";
import { EMPTY_PATIENT_FORM, type Patient, type PatientInput } from "../types";
import { matchesQuery, patientToFormValues } from "../utils";
import { ConfirmDialog } from "./confirm-dialog";
import { DetailsDialog } from "./details-dialog";
import { NoticeBanner } from "./notice-banner";
import { PatientForm } from "./patient-form";
import { PatientTable } from "./patient-table";

/** Which form (if any) is open. `null` means the form is closed. */
type FormState = { mode: "create" } | { mode: "edit"; patientId: string } | null;

interface Notice {
  message: string;
  /** Changes on every notice so identical messages still restart the timer. */
  key: number;
}

const NOTICE_DURATION_MS = 6000;

/**
 * The Patients page: header, statistic, search, table and every dialog.
 *
 * This is the only component that owns UI state. Child components are
 * presentational: they receive data and callbacks and report events upward.
 * Patient data itself comes from the usePatients() hook.
 */
export function PatientsManager({ clinic }: { clinic: Clinic }) {
  const { patients, addPatient, updatePatient, deletePatient } = usePatients(clinic.id);

  const [query, setQuery] = useState("");
  const [formState, setFormState] = useState<FormState>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  // Remember what had focus when the form opened, so closing it puts focus back.
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const restoreFocusOnClose = useRef(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  // Runs after the form has actually unmounted, so focus can't be stolen back
  // from a form that was reopened in the meantime (unlike a timer-based approach).
  useEffect(() => {
    if (formState !== null || !restoreFocusOnClose.current) return;
    restoreFocusOnClose.current = false;
    const target = returnFocusRef.current;
    (target?.isConnected ? target : addButtonRef.current)?.focus();
  }, [formState]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), NOTICE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [notice]);

  // Derived values: computed from state during render, never stored in state.
  const results = useMemo(
    () => patients.filter((patient) => matchesQuery(patient, query)),
    [patients, query],
  );
  const hasQuery = query.trim().length > 0;
  const viewing = patients.find((patient) => patient.id === viewingId) ?? null;
  const deleting = patients.find((patient) => patient.id === deletingId) ?? null;
  const editing =
    formState?.mode === "edit"
      ? patients.find((patient) => patient.id === formState.patientId) ?? null
      : null;

  function announce(message: string) {
    setNotice({ message, key: Date.now() });
  }

  function openForm(next: Exclude<FormState, null>) {
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setFormState(next);
  }

  function closeForm() {
    restoreFocusOnClose.current = true;
    setFormState(null);
  }

  function handleSubmit(data: PatientInput) {
    if (formState?.mode === "edit") {
      updatePatient(formState.patientId, data);
      announce(`${data.fullName}'s details were updated.`);
    } else {
      const created = addPatient(data);
      setQuery(""); // make sure the new patient isn't hidden by an active search
      announce(`${created.fullName} was added as ${created.patientNumber}.`);
    }
    closeForm();
  }

  function confirmDelete() {
    if (!deleting) return;
    deletePatient(deleting.id);
    if (formState?.mode === "edit" && formState.patientId === deleting.id) closeForm();
    announce(`${deleting.fullName} (${deleting.patientNumber}) was deleted.`);
    setDeletingId(null);
  }

  return (
    <>
      <section className="welcome-section">
        <div>
          <p className="eyebrow">PATIENT MANAGEMENT</p>
          <h2>Patients</h2>
          <p className="welcome-subtitle">
            Register patients, find records by name or phone number, and keep contact details in
            one place. Sample data only: changes are temporary and reset when you reload the page.
          </p>
        </div>
        <button
          ref={addButtonRef}
          type="button"
          className="primary-button"
          aria-expanded={formState !== null}
          onClick={() => openForm({ mode: "create" })}
        >
          ＋ Add Patient
        </button>
      </section>

      <NoticeBanner message={notice?.message ?? null} onDismiss={() => setNotice(null)} />

      {formState && (
        <PatientForm
          // A new key resets the form's internal state when switching between add / edit targets.
          key={editing ? editing.id : "create"}
          mode={formState.mode}
          initialValues={editing ? patientToFormValues(editing) : EMPTY_PATIENT_FORM}
          timeZone={clinic.settings.timeZone}
          onSubmit={handleSubmit}
          onClose={closeForm}
        />
      )}

      <section className="stats-grid patients-stats" aria-label="Patient statistics">
        <article className="stat-card tone-mint">
          <div className="stat-top">
            <span>Total patients</span>
            <div className="stat-icon" aria-hidden="true">♙</div>
          </div>
          <div className="stat-value">{patients.length}</div>
          <div className="stat-bottom">
            <span className="patients-stat-note">Sample data · resets on reload</span>
          </div>
          <div className="card-decoration" />
        </article>
      </section>

      <section className="panel">
        <div className="patient-toolbar">
          <div className="search-field">
            <label htmlFor="patient-search" className="visually-hidden">
              Search patients by name or phone number
            </label>
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              id="patient-search"
              type="search"
              className="search-input"
              placeholder="Search by name or phone number…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
            />
          </div>
          <p className="result-count" aria-live="polite">
            {hasQuery
              ? `${results.length} of ${patients.length} patients`
              : `${patients.length} ${patients.length === 1 ? "patient" : "patients"}`}
          </p>
        </div>

        {results.length > 0 ? (
          <PatientTable
            patients={results}
            settings={clinic.settings}
            onView={(patient: Patient) => setViewingId(patient.id)}
            onEdit={(patient: Patient) => openForm({ mode: "edit", patientId: patient.id })}
            onDelete={(patient: Patient) => setDeletingId(patient.id)}
          />
        ) : hasQuery ? (
          <div className="empty-state">
            <div className="empty-icon" aria-hidden="true">⌕</div>
            <h3>No matching patients</h3>
            <p>Nothing matches “{query.trim()}”. Check the spelling, or try part of a phone number.</p>
            <button type="button" className="btn-secondary" onClick={() => setQuery("")}>Clear search</button>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon" aria-hidden="true">♙</div>
            <h3>No patients yet</h3>
            <p>Add your first patient to start building the list.</p>
            <button type="button" className="primary-button" onClick={() => openForm({ mode: "create" })}>
              ＋ Add Patient
            </button>
          </div>
        )}
      </section>

      <DetailsDialog patient={viewing} settings={clinic.settings} onClose={() => setViewingId(null)} />

      <ConfirmDialog
        open={deleting !== null}
        title="Delete this patient?"
        confirmLabel="Delete patient"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      >
        <p>
          <strong>{deleting?.fullName}</strong>
          {deleting ? ` (${deleting.patientNumber})` : ""} will be removed from the list. This cannot be undone.
        </p>
        <p className="dialog-note">Demo data: reloading the page restores the sample patients.</p>
      </ConfirmDialog>
    </>
  );
}
