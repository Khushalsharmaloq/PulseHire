import api from "./api";

const AUTH_BASE = "/user";

export const registerUser = (payload) => {
  return api.post(`${AUTH_BASE}/register`, payload);
};

export const loginUser = (payload) => {
  return api.post(`${AUTH_BASE}/login`, payload);
};

export const logoutUser = () => {
  return api.post(`${AUTH_BASE}/logout`);
};

export const getCurrentUser = () => {
  return api.get(`${AUTH_BASE}/me`);
};
