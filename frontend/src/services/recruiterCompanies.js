import api from "./api";

/* =========================================================
   GET MY COMPANIES
   ========================================================= */

export const getRecruiterCompanies = async () => {
  const response = await api.get("/company/my");

  return response.data;
};

/* =========================================================
   CREATE COMPANY
   ========================================================= */

export const createRecruiterCompany = async (company) => {
  const response = await api.post("/company/create", company);

  return response.data;
};

/* =========================================================
   UPDATE COMPANY
   ========================================================= */

export const updateRecruiterCompany = async (companyId, company) => {
  const response = await api.put(`/company/${companyId}`, company);

  return response.data;
};

/* =========================================================
   GET JOBS FOR ONE COMPANY
   ========================================================= */

export const getRecruiterCompanyJobs = async (companyId) => {
  const response = await api.get(`/company/${companyId}/jobs`);

  return response.data;
};
