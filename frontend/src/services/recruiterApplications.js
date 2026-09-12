import api from "./api";


/*
|--------------------------------------------------------------------------
| GET APPLICATIONS FOR A RECRUITER'S JOB
|--------------------------------------------------------------------------
*/

export const getRecruiterJobApplications =
  async (
    jobId
  ) => {

    const response =
      await api.get(
        `/application/job/${jobId}`
      );


    return response.data;

  };


/*
|--------------------------------------------------------------------------
| UPDATE APPLICATION STATUS
|--------------------------------------------------------------------------
*/

export const updateRecruiterApplicationStatus =
  async (
    applicationId,
    status
  ) => {

    const response =
      await api.patch(
        `/application/${applicationId}/status`,
        {
          status,
        }
      );


    return response.data;

  };