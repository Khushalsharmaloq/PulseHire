import api from "./api";


/* =========================================================
   GET RECRUITER'S JOBS
   ========================================================= */

export const getRecruiterJobs = async () => {
  const response = await api.get(
    "/job/my"
  );

  return response.data;
};


/* =========================================================
   UPDATE JOB STATUS
   ========================================================= */

export const updateRecruiterJobStatus = async (
  jobId,
  status
) => {
  const response = await api.patch(
    `/job/${jobId}/status`,
    {
      status,
    }
  );

  return response.data;
};