import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/app-shell/app-shell";
import { getCurrentClinic } from "@/lib/tenant/current-clinic";
import { PatientsManager } from "@/features/patients/components/patients-manager";
import "@/features/patients/patients.css";

export const metadata: Metadata = { title: "Patients" };

/**
 * Server Component: renders the dashboard frame and hands everything
 * interactive to <PatientsManager clinic={clinic} />, the one Client Component boundary.
 */
export default function PatientsPage() {
  const clinic = getCurrentClinic();

  return (
    <AppShell section="Patients">
      <Link href="/" className="back-link">← Back to dashboard</Link>
      <PatientsManager clinic={clinic} />
    </AppShell>
  );
}
