import { Suspense, type ReactNode } from "react";
import { getCurrentClinic } from "@/lib/tenant/current-clinic";
import { NavList, SidebarNav } from "./sidebar-nav";

interface AppShellProps {
  /** Name of the current section, shown in the topbar breadcrumb. */
  section: string;
  children: ReactNode;
}

/**
 * The dashboard frame (sidebar + topbar) shared by every signed-in page.
 * Markup and class names are intentionally identical to the original
 * homepage so the existing styles in globals.css apply unchanged.
 */
export function AppShell({ section, children }: AppShellProps) {
  const clinic = getCurrentClinic();

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">C</div>
          <div>
            <h1>ClinicDesk<span> AI</span></h1>
            <p>INTELLIGENT HEALTHCARE</p>
          </div>
        </div>

        <div className="workspace">
          <div className="workspace-icon">✚</div>
          <div>
            <strong>{clinic.name}</strong>
            <small>{clinic.locationLabel}</small>
          </div>
          <span className="workspace-arrow">⌄</span>
        </div>

        <p className="nav-heading">WORKSPACE</p>
        <Suspense fallback={<NavList pathname={null} />}>
          <SidebarNav />
        </Suspense>

        <div className="sidebar-bottom">
          <div className="ai-card">
            <div className="ai-spark">✧</div>
            <strong>ClinicDesk Intelligence</strong>
            <p>Your clinic operations, made simpler.</p>
            <span>AI ASSISTANT · COMING SOON</span>
          </div>
          <a href="#" className="nav-link"><span className="nav-icon">⚙</span> Settings</a>
          <div className="profile">
            <div className="avatar admin-avatar">AD</div>
            <div><strong>Clinic Admin</strong><small>Administrator</small></div>
            <span className="profile-dots">•••</span>
          </div>
        </div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> <strong>{section}</strong></div>
          <div className="top-actions">
            <span className="live-indicator"><i /> System operational</span>
            <button className="icon-button" aria-label="Notifications">♧<i /></button>
            <div className="avatar top-avatar">AD</div>
          </div>
        </header>

        <div className="content">{children}</div>
      </section>
    </main>
  );
}
