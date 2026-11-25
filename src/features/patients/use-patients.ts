import { useCallback, useMemo, useState } from "react";
import { MOCK_PATIENTS } from "./mock-data";
import type { Patient, PatientInput } from "./types";
import { createId, nextPatientNumber } from "./utils";

/**
 * Patient records for ONE clinic (tenant).
 *
 * DEMO ONLY: records live in React state, so they are NOT saved anywhere.
 * Reloading the page restores the sample patients.
 *
 * Tenant scoping: the hook is told which clinic it works for. It only returns
 * that clinic's patients, stamps `clinicId` on new ones, and refuses to edit or
 * delete another clinic's record even if handed its ID. This shapes the code
 * the way the real system will work, but it is NOT security: the browser can
 * be tampered with. Real isolation is enforced by the database (Row Level
 * Security on clinic_id) and a server-resolved session.
 *
 * Components use only the four values returned here. When the database phase
 * starts, this hook is the one place that changes (state -> Supabase calls).
 */
export function usePatients(clinicId: string, initialPatients: readonly Patient[] = MOCK_PATIENTS) {
  const [allPatients, setAllPatients] = useState<Patient[]>(() => [...initialPatients]);

  const patients = useMemo(
    () => allPatients.filter((patient) => patient.clinicId === clinicId),
    [allPatients, clinicId],
  );

  const addPatient = useCallback(
    (input: PatientInput): Patient => {
      const patient: Patient = {
        ...input,
        id: createId(),
        clinicId,
        patientNumber: nextPatientNumber(patients),
        registeredAt: new Date().toISOString(),
      };
      setAllPatients((current) => [patient, ...current]);
      return patient;
    },
    [clinicId, patients],
  );

  const updatePatient = useCallback(
    (id: string, input: PatientInput) => {
      setAllPatients((current) =>
        current.map((patient) =>
          patient.id === id && patient.clinicId === clinicId ? { ...patient, ...input } : patient,
        ),
      );
    },
    [clinicId],
  );

  const deletePatient = useCallback(
    (id: string) => {
      setAllPatients((current) =>
        current.filter((patient) => !(patient.id === id && patient.clinicId === clinicId)),
      );
    },
    [clinicId],
  );

  return { patients, addPatient, updatePatient, deletePatient };
}
