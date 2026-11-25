# ClinicDesk AI: Product Requirements

Confirmed product decisions, and the engineering rules that follow from them.
Update this file whenever a decision changes. Do not rely on chat history.

## Confirmed product decisions

| # | Area | Decision |
|---|------|----------|
| 1 | Target market | International, serving all countries. |
| 2 | Target customers | Small clinics, medium-sized clinics and large healthcare facilities. |
| 3 | Pricing model | Tiered subscriptions: Starter, Professional and Enterprise. (Limits per tier are not defined yet.) |
| 4 | Default language | English. |
| 5 | Future languages | Somali, Turkish, Arabic and others. |
| 6 | Architecture | Multi-tenant SaaS with strict clinic-level data isolation. |
| 7 | International support | Configurable currencies, time zones, date formats and localization. |
| 8 | Subscription access | A centralized, configurable plan and feature-permission system. |

## Engineering rules that follow

### Tenant isolation (decision 6)
- Every tenant-owned record carries a `clinicId` (`clinic_id` in the database).
- **Real isolation is enforced in the database**: Postgres Row Level Security on every
  table, with policies based on the signed-in user's clinic membership.
- The active clinic is resolved **on the server from the session**. Never trust a clinic
  ID sent by the browser or placed in a URL.
- Client-side scoping (for example in `usePatients`) shapes the code but is **not security**.
- The Supabase service-role key is server-only and never reaches the browser.
- Test isolation with a second tenant, not only the happy path.

### Identifiers
- `Patient.id` is an opaque UUID used as the key and, later, in URLs and the database.
- `Patient.patientNumber` (e.g. `CD-1001`) is the human-friendly ID shown to staff.
  It is unique per clinic, with its own sequence per clinic.
- Search covers the patient number, never the opaque ID.

### Internationalization (decisions 4, 5, 7)
- No hard-coded locale, time zone, currency or date format in logic. They come from
  clinic settings (`ClinicSettings` in `src/lib/tenant/current-clinic.ts`).
- Store moments as UTC timestamps; display them in the clinic's time zone.
  A calendar date (date of birth) is not a moment and is never time-zone shifted.
- Validation returns **codes**, not English sentences. Wording lives in a message table
  (`validation-messages.ts`).
- Use CSS logical properties (`inline-start`, `margin-inline`, ...) for new styles so
  layouts can mirror for right-to-left languages such as Arabic.
  Known gap: `src/app/globals.css` still uses physical `left`/`right`.
- Names are Unicode-aware. Do not assume first name / last name; use a single full name.
- Language should be a clinic/user setting, not a URL prefix.

### Plans and feature access (decisions 3, 8)
- One central configuration defines plans, features and limits. Components never
  hard-code a plan name or a limit.
- UI gating is cosmetic. **Enforcement happens on the server** (RLS and server checks).

### Healthcare data
- Plan for GDPR, KVKK, HIPAA and similar rules. Data residency (hosting region per
  tenant) must be decided before the database phase.
- Real deletion of patient records is likely restricted by retention law: prefer
  archive / soft delete plus an audit log. The demo's hard delete is for demonstration only.

## Open decisions
- Is a tenant a single clinic, or an organization with several branches?
- Data-residency strategy and Supabase region(s).
- Plan limits for Starter, Professional and Enterprise.
- Localization library and rollout (planned as its own task before Appointments).

## Current phase
Phase 2: Patient Management, demo data only. **Not yet built**: authentication, billing,
database and migrations, AI features, plan enforcement, translations.
