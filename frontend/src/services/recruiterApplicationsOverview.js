import api from "./api";

/* =========================================================
   GET APPLICATIONS FOR ONE JOB
   ========================================================= */

const getApplicationsForJob = async (jobId) => {
  const response = await api.get(`/application/job/${jobId}`);

  return response.data;
};

/* =========================================================
   GET ALL RECRUITER APPLICATIONS
   =========================================================
   
   The current backend exposes recruiter applications
   per job rather than one aggregate endpoint.

   Therefore we:
   1. Load the recruiter's jobs.
   2. Request applications for each job.
   3. Combine them on the frontend.
   ========================================================= */

export const getRecruiterApplicationsOverview = async (jobs) => {
  const recruiterJobs = Array.isArray(jobs)
    ? jobs.filter((job) => Boolean(job?._id))
    : [];

  if (recruiterJobs.length === 0) {
    return {
      success: true,

      applications: [],

      summary: {
        total: 0,

        applied: 0,

        reviewing: 0,

        shortlisted: 0,

        interview: 0,

        rejected: 0,

        hired: 0,
      },
    };
  }

  const responses = await Promise.all(
    recruiterJobs.map(async (job) => {
      try {
        const response = await getApplicationsForJob(job._id);

        return {
          job,

          response,
        };
      } catch (error) {
        console.error(`Unable to load applications for job ${job._id}:`, error);

        return {
          job,

          response: null,
        };
      }
    }),
  );

  const applications = [];

  responses.forEach(({ job, response }) => {
    if (!response?.success || !Array.isArray(response.applications)) {
      return;
    }

    response.applications.forEach((application) => {
      applications.push({
        ...application,

        job: {
          ...(application?.job || {}),

          id: application?.job?.id || application?.job?._id || job?._id,

          title: application?.job?.title || job?.title || "Untitled role",

          company: application?.job?.company || job?.company,

          location: application?.job?.location || job?.location,

          status: application?.job?.status || job?.status,
        },

        recruiterJobId: job?._id,
      });
    });
  });

  applications.sort((first, second) => {
    const firstDate = new Date(first?.appliedAt || 0).getTime();

    const secondDate = new Date(second?.appliedAt || 0).getTime();

    return secondDate - firstDate;
  });

  const summary = {
    total: applications.length,

    applied: applications.filter(
      (application) => application?.status === "applied",
    ).length,

    reviewing: applications.filter(
      (application) => application?.status === "reviewing",
    ).length,

    shortlisted: applications.filter(
      (application) => application?.status === "shortlisted",
    ).length,

    interview: applications.filter(
      (application) => application?.status === "interview",
    ).length,

    rejected: applications.filter(
      (application) => application?.status === "rejected",
    ).length,

    hired: applications.filter((application) => application?.status === "hired")
      .length,
  };

  return {
    success: true,

    applications,

    summary,
  };
};
