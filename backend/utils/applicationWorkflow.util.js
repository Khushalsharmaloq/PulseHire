export const APPLICATION_STATUSES = [
  "applied",
  "reviewing",
  "shortlisted",
  "interview",
  "rejected",
  "hired",
];

export const RECRUITER_SETTABLE_APPLICATION_STATUSES = [
  "reviewing",
  "shortlisted",
  "interview",
  "rejected",
  "hired",
];

export const APPLICATION_TRANSITIONS = {
  applied: ["reviewing", "rejected"],
  reviewing: ["shortlisted", "rejected"],
  shortlisted: ["interview", "rejected"],
  interview: ["hired", "rejected"],
  rejected: [],
  hired: [],
};

export const isTerminalApplicationStatus = (status) =>
  status === "rejected" || status === "hired";

export const canTransitionApplication = (currentStatus, nextStatus) =>
  Boolean(APPLICATION_TRANSITIONS[currentStatus]?.includes(nextStatus));
