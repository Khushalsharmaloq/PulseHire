import api from "./api";


/* =========================================================
   GET CURRENT USER
   ========================================================= */

export const getCurrentUser =
  async () => {

    const response =
      await api.get(
        "/user/me"
      );

    return response.data;
  };


/* =========================================================
   UPDATE PROFILE
   ========================================================= */

export const updateRecruiterProfile =
  async (
    profile
  ) => {

    const response =
      await api.put(
        "/user/profile",
        profile
      );

    return response.data;
  };


/* =========================================================
   UPLOAD PROFILE PHOTO
   ========================================================= */

export const uploadRecruiterProfilePhoto =
  async (
    file
  ) => {

    const formData =
      new FormData();

    formData.append(
      "profilePhoto",
      file
    );


    const response =
      await api.put(
        "/user/profile/photo",
        formData
      );


    return response.data;
  };


/* =========================================================
   UPLOAD RESUME
   ========================================================= */

export const uploadRecruiterResume =
  async (
    file
  ) => {

    const formData =
      new FormData();

    formData.append(
      "resume",
      file
    );


    const response =
      await api.put(
        "/user/profile/resume",
        formData
      );


    return response.data;
  };