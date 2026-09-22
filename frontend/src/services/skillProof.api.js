import api from "./api";

export const getMySkillProofs = async () => {
  const response = await api.get("/skill-proof/my");

  return response.data;
};

export const createSkillProof = async (payload) => {
  const response = await api.post("/skill-proof", payload);

  return response.data;
};
