import api from "./api";

/* =========================================================
   GET RECRUITER APPLICATIONS OVERVIEW
   =========================================================

   The backend returns the recruiter-wide application dataset
   in one request, including job context and verified-skill
   match metrics. This avoids one request per recruiter job.
   ========================================================= */

export const getRecruiterApplicationsOverview = async () => {
  const response = await api.get("/application/recruiter");

  return response.data;
};
