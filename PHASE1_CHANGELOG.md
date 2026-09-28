# Phase 1 — Production Hardening Changelog

## Trust and authorization

- Added recruiter verification states: pending, verified, rejected.
- Added server-side `requireVerifiedRecruiter` enforcement for sensitive recruiter APIs.
- Added administrator recruiter-review APIs and frontend review workspace.
- Scoped recruiter skill-proof access/review to candidates in the recruiter's own applicant pool.
- Paused active jobs when recruiter verification is rejected/revoked or a verified recruiter changes identity email.
- Public jobs and application creation now check that the owning recruiter remains active and verified.

## Candidate document privacy

- Removed logging of resume upload objects/buffers.
- New resumes upload as authenticated/private Cloudinary raw assets.
- Added short-lived signed resume delivery.
- Candidate resume access requires authentication; recruiter access additionally requires an applicant relationship.
- Added private Cloudinary identifiers to the model while excluding them from normal query output.
- Kept a compatibility fallback for legacy public resume records.
- Added upload magic-byte checks and stricter MIME/extension validation.

## Authentication and API hardening

- Removed default/hard-coded admin credentials.
- Admin bootstrap now requires explicit environment values and a stronger password.
- Password hashes are excluded from normal user queries.
- Centralized auth-cookie settings.
- Added baseline security headers.
- Added baseline in-memory rate limiting for public/auth entry points.
- Added environment validation and production-configurable CORS origins.
- Added account suspension enforcement.
- Escaped public regex search input and bounded search text length.
- Added public job pagination.
- Tightened salary/status validation.
- Prevented generic profile JSON updates from overwriting upload-managed resume/photo fields.

## Hiring workflow integrity

- Added append-only application status history with actor role and timestamp.
- Centralized valid application transitions.
- Added query indexes for common job/company access patterns.

## Matching correctness and API efficiency

- Match scoring now uses structured `job.skills`, not free-text `job.requirements`.
- Candidate Job Details now consumes the dedicated job-detail API rather than fetching every job and every application to reconstruct one page.
- Recruiter Applications Overview now uses one recruiter-wide backend request instead of one application request per job, and the response includes evidence-backed match metrics.
- Skill-gap analysis now considers only jobs from active, verified recruiters and bounds the default analysis set to the 100 most recent roles (configurable up to 200 per request), with scope metadata in the response.

## Frontend account-state UX

- Added verified-recruiter route guard.
- Added pending/rejected recruiter verification page and focused navigation.
- Added admin recruiter-verification UI.
- Added authenticated resume URL helpers and updated candidate/recruiter resume links.

## Tests and documentation

- Added Node regression tests for matching, application workflow, safe regex escaping, and pagination parsing.
- Added backend `.env.example` covering security/deployment/admin settings.
- Added project-level architecture, setup, trust-model, test, and production-readiness documentation.
- Added GitHub Actions CI for dependency installation, backend tests/syntax checks, frontend lint, and frontend production build.

## Verification completed during this pass

- All backend JavaScript files pass `node --check`.
- 8/8 backend regression tests pass.
- Dependency download/install validation is environment-dependent and should be repeated in CI or a normal developer environment with registry access.
