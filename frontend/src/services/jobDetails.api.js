import api from "./api";

export const getAllJobs = async () => {
  const response = await api.get("/job/all");

  return response.data;
};

export const getSkillGap = async () => {
  const response = await api.get("/skill-gap");

  return response.data;
};

export const getMyApplications = async () => {
  const response = await api.get("/application/my");

  return response.data;
};

export const applyToJob = async ({ jobId, intentResponse }) => {
  const response = await api.post("/application/apply", {
    jobId,
    intentResponse,
  });

  return response.data;
};