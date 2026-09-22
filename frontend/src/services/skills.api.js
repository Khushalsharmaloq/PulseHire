import api from "./api";

export const getSkillGap = async () => {
  const response = await api.get("/skill-gap");

  return response.data;
};
