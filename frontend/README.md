# PulseHire Frontend

React/Vite client for PulseHire candidate, recruiter, and administrator workflows.

## Setup

```bash
cp .env.example .env
npm ci
npm run dev
```

Configure:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Use the URL for your actual backend deployment outside local development.

## Quality checks

```bash
npm run lint
npm run build
```

## Account routing

- Candidates enter the candidate workspace.
- Recruiters in `pending` or `rejected` verification state are routed to `/recruiter/account-verification` and can maintain onboarding/company information.
- Verified recruiters can access the full recruiter workspace.
- Administrators use `/admin/recruiters` to review recruiter verification status.

Resume links intentionally target authenticated backend download endpoints instead of exposing raw storage URLs in the UI.
