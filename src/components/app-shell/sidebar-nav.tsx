"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  icon: string;
  label: string;
  /** Pages that don't exist yet have no href and render as inert placeholders. */
  href?: string;
  count?: number;
}

const NAV_ITEMS: NavItem[] = [
  { icon: "◈", label: "Overview", href: "/" },
  { icon: "♙", label: "Patients", href: "/patients" },
  { icon: "▦", label: "Appointments", count: 4 },
  { icon: "✚", label: "Doctors" },
  { icon: "▤", label: "Medical Records" },
  { icon: "▧", label: "Analytics" },
];

function isActive(pathname: string | null, href: string): boolean {
  if (pathname === null) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Pure rendering of the nav for a given pathname (null = nothing highlighted). */
export function NavList({ pathname }: { pathname: string | null }) {
  return (
    <nav className="navigation" aria-label="Main">
      {NAV_ITEMS.map((item) => {
        const content = (
          <>
            <span className="nav-icon">{item.icon}</span>
            {item.label}
            {item.count !== undefined && (
              <span className="nav-count">{item.count}</span>
            )}
          </>
        );

        if (!item.href) {
          return (
            <a href="#" key={item.label} className="nav-link">
              {content}
            </a>
          );
        }

        const active = isActive(pathname, item.href);
        return (
          <Link
            href={item.href}
            key={item.label}
            className={`nav-link${active ? " active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * Client component because the active link depends on the current URL.
 *
 * With Cache Components, the URL of a dynamic route (/patients/[id]) is
 * request-time data, so AppShell renders this inside <Suspense> with an
 * un-highlighted <NavList> as the fallback. Same size, so nothing shifts.
 */
export function SidebarNav() {
  const pathname = usePathname();
  return <NavList pathname={pathname} />;
}
