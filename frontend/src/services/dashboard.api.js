import api from "./api";

export const getCurrentUser = async () => {
  const response = await api.get("/user/me");

  return response.data;
};

export const getSkillGapDashboard = async () => {
  const response = await api.get("/skill-gap");

  return response.data;
};

export const getDashboardApplications = async () => {
  const response = await api.get("/application/my");

  return response.data;
};

export const getDashboardSkillProofs = async () => {
  const response = await api.get("/skill-proof/my");

  return response.data;
};

export const getDashboardJobs = async () => {
  const response = await api.get("/job/all");

  return response.data;
};

export const getDashboardLearning = async () => {
  const response = await api.get("/learning/resources");

  return response.data;
};
