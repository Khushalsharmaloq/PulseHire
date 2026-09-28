# PulseHire

PulseHire is a full-stack hiring platform focused on evidence-backed skills, job matching, recruiter workflows, applications, analytics, and candidate development.

This repository contains a React/Vite frontend and an Express/MongoDB backend. The current hardening pass adds a recruiter-verification trust boundary, private resume delivery, safer public APIs, application status auditing, and baseline regression tests.

## Architecture

```text
PulseHire
├── frontend/                 React 19 + Vite client
│   └── src/
│       ├── app/router/       role and verification-aware routing
│       ├── components/       shared UI/shell components
│       ├── pages/            candidate, recruiter, admin flows
│       ├── services/         API clients
│       └── styles/           design system and page styles
└── backend/                  Express 5 API
    ├── config/               environment validation
    ├── controllers/          request/business logic
    ├── middlewares/          auth, role, verification, upload/security
    ├── models/               Mongoose schemas
    ├── routes/               API routes
    ├── scripts/              administrative bootstrap scripts
    ├── tests/                Node regression tests
    └── utils/                reusable domain/security helpers
```

## Trust model

### Candidates
Candidates can manage their profile, submit skill evidence, browse verified-recruiter jobs, apply, track applications, and use skill-gap/learning features.

### Recruiters
A newly registered recruiter starts in `pending` verification state. Pending recruiters may complete company/profile onboarding, but sensitive recruiter capabilities remain blocked until an administrator approves the account.

A verified recruiter can work only with candidates who entered that recruiter's applicant pool. Skill-proof review is scoped to those candidates; it is no longer a global recruiter queue.

Changing the recruiter's account email resets verification to `pending` and pauses active jobs so approval remains tied to the reviewed identity.

### Administrators
Administrators review recruiter accounts from `/admin/recruiters`. They can approve or reject/revoke verification, record review notes, and a rejection pauses the recruiter's active jobs.

Admin users are bootstrapped from explicit environment variables; there are no default admin credentials in source control.

## Security-sensitive behavior

- Password hashes are excluded from normal Mongoose queries and use bcrypt.
- Authentication uses HttpOnly JWT cookies with environment-aware cookie settings.
- Suspended accounts are rejected by authentication middleware.
- Login and other public entry points have baseline in-process rate limiting.
- Public job search escapes user input before constructing MongoDB regex filters.
- Public jobs and applications require the owning recruiter to remain active and verified.
- New resumes are uploaded as authenticated/private Cloudinary raw assets.
- Resume downloads use short-lived signed URLs after server-side authorization.
- Recruiters may download a candidate resume only when that candidate has applied to one of their jobs.
- File extension/MIME checks are backed by magic-byte validation for supported uploads.
- Application status changes are recorded in `statusHistory` with actor and timestamp.
- CORS origins, cookie settings, proxy behavior, secrets, and Cloudinary configuration are environment-driven.
- Baseline security headers are applied by the API.

> Legacy resume URLs created before this hardening pass remain readable through a compatibility fallback. Re-upload legacy resumes if you need all historical documents moved to private Cloudinary delivery.

## Local prerequisites

- Node.js 20+ recommended
- npm
- MongoDB deployment or local MongoDB
- Cloudinary account

## Backend setup

```bash
cd backend
cp .env.example .env
npm ci
npm run dev
```

Required environment values are documented in `backend/.env.example`.

Important production settings:

- Use a long, random `JWT_SECRET`.
- Set `CLIENT_ORIGINS` to the exact allowed browser origin(s), comma-separated.
- Set `COOKIE_SECURE=true` behind HTTPS.
- Choose `COOKIE_SAME_SITE` to match your frontend/API deployment topology.
- Set `TRUST_PROXY` correctly when running behind a reverse proxy/load balancer.

## Frontend setup

```bash
cd frontend
cp .env.example .env
npm ci
npm run dev
```

Set `VITE_API_BASE_URL` to the backend API base URL.

## Bootstrap an administrator

Set the following values in the backend environment:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=use-a-unique-password-with-at-least-12-characters
ADMIN_PHONE=0000000000
ADMIN_FULLNAME=PulseHire Admin
```

Then run:

```bash
cd backend
npm run create-admin
```

Do not store real administrator credentials in committed `.env` files, shell scripts, documentation, or source code. Rotate bootstrap credentials after first deployment according to your operational policy.

## Verification workflow

1. A recruiter registers.
2. Their account is created with `recruiterVerification.status = "pending"`.
3. They complete company details while awaiting review.
4. An admin signs in and opens `/admin/recruiters`.
5. The admin reviews the recruiter and company context, then approves or rejects the account.
6. Only a `verified` recruiter can publish/manage jobs, access candidates/applications, review skill evidence, or use recruiter analytics.

## Tests and checks

Backend regression tests:

```bash
cd backend
npm test
```

Backend syntax checks:

```bash
find . -name '*.js' -not -path './node_modules/*' -print0 | xargs -0 -n1 node --check
```

Frontend verification:

```bash
cd frontend
npm run lint
npm run build
```

The current tests cover core matching normalization/scoring, application workflow transitions, safe regex escaping, and pagination input clamping. `.github/workflows/ci.yml` installs both workspaces, runs backend tests/syntax checks, lints the frontend, and builds the frontend on pushes and pull requests. Production deployment should still add database-backed controller/integration tests and browser E2E tests.

## Matching behavior

Job match percentages use the structured `skills` field. Free-text `requirements` are intentionally excluded from the skill score, preventing sentences such as “3+ years of experience” or “Bachelor's degree preferred” from being treated as literal skills.

The present matcher remains a deterministic MVP heuristic. A production hiring decision should not rely on the percentage as an autonomous ranking or employment decision. Future iterations should add a controlled skill taxonomy/aliases, required-vs-preferred weighting, proficiency/recency, transparent explanations, and human review.

## Production deployment checklist

Before handling real candidate data at scale:

- Put the API behind HTTPS and a production reverse proxy/load balancer.
- Use managed secrets; never commit `.env` files.
- Use a durable/distributed rate-limit store (for example Redis) when running multiple API instances.
- Add email ownership verification, password reset/change, stronger session management/revocation, and CSRF protection appropriate to the final deployment topology.
- Add company/domain verification and organization/team membership instead of a single-owner company model.
- Migrate/re-upload historical public resumes to private storage.
- Add malware scanning and a retention/deletion policy for uploaded candidate documents.
- Add structured logs, request IDs, audit-event retention, monitoring, backups, and alerting.
- Add database-backed integration tests and end-to-end tests to CI.
- Add deeper aggregation/caching to high-volume analytics and introduce explicit candidate target-role preferences for skill-gap analysis.
- Review privacy, employment, accessibility, and data-retention requirements for the jurisdictions where PulseHire operates.

## Current known architecture follow-ups

This hardening pass is a foundation, not a claim that the system is finished for regulated production use. The highest-value next work is:

1. organization/company membership and verification;
2. email verification, password reset/change, and session revocation;
3. database-backed auth/authorization integration tests;
4. paginated recruiter-wide application APIs and target-role-driven skill-gap analysis;
5. skill taxonomy and explainable match scoring;
6. notification/interview/team collaboration workflows;
7. CI/CD, observability, backup/restore, and data lifecycle operations.

## License

The backend package currently declares ISC. Confirm the intended repository-wide license before public or commercial distribution.
