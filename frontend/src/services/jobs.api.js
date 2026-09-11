import api from "./api";


export const getAllJobs = async () => {
  const response = await api.get("/job/all");

  return response.data;
};


export const getMyApplications = async () => {
  const response = await api.get("/application/my");

  return response.data;
};


export const getMySkillProofs = async () => {
  const response = await api.get("/skill-proof/my");

  return response.data;
};