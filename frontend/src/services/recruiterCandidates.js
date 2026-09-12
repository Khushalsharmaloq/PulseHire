import api from "./api";


/* =========================================================
   GET RECRUITER CANDIDATES
   ========================================================= */

export const getRecruiterCandidates =
  async (
    jobId = ""
  ) => {

    const params = {};


    if (
      jobId
    ) {

      params.jobId =
        jobId;

    }


    const response =
      await api.get(
        "/candidate/recruiter",
        {
          params,
        }
      );


    return response.data;
  };


/* =========================================================
   GET ONE RECRUITER CANDIDATE
   ========================================================= */

export const getRecruiterCandidateById =
  async (
    candidateId
  ) => {

    const response =
      await api.get(
        `/candidate/recruiter/${candidateId}`
      );


    return response.data;
  };