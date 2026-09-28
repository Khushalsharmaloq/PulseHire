const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const getOwnResumeUrl = () => `${API_BASE_URL}/user/profile/resume`;

export const getCandidateResumeUrl = (candidateId) =>
  `${API_BASE_URL}/candidate/recruiter/${candidateId}/resume`;
