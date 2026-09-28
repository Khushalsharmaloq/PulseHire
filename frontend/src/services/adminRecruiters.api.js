import api from "./api";

export const getRecruiterVerificationQueue = async ({
  status = "pending",
  page = 1,
  limit = 25,
} = {}) => {
  const response = await api.get("/user/admin/recruiters", {
    params: { status, page, limit },
  });

  return response.data;
};

export const reviewRecruiterVerification = async ({
  recruiterId,
  status,
  note = "",
}) => {
  const response = await api.patch(
    `/user/admin/recruiters/${recruiterId}/verification`,
    { status, note },
  );

  return response.data;
};
