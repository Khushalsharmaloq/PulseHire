import api from "./api";

export const getMyApplications = async () => {
  const response = await api.get("/application/my");

  return response.data;
};
