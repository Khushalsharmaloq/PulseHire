import api from "./api";

export const updateProfile = async (payload) => {
  const response = await api.put("/user/profile", payload);

  return response.data;
};

export const uploadProfilePhoto = async (formData) => {
  const response = await api.put("/user/profile/photo", formData);

  return response.data;
};

export const uploadResume = async (formData) => {
  const response = await api.put("/user/profile/resume", formData);

  return response.data;
};
