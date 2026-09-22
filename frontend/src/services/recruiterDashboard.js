import api from "./api";

/* =========================================================
   GET RECRUITER ANALYTICS
   ========================================================= */

export const getRecruiterAnalytics = async () => {
  const response = await api.get("/analytics/recruiter");

  return response.data;
};
