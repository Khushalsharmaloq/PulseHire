import api from "./api";


export const getLearningResources =
  async () => {

    const response =
      await api.get(
        "/learning/resources"
      );

    return response.data;

  };


export const getLearningProgress =
  async () => {

    const response =
      await api.get(
        "/learning/progress"
      );

    return response.data;

  };


export const updateLearningProgress =
  async (
    resourceId,
    progressPercent
  ) => {

    const response =
      await api.put(
        "/learning/progress",
        {
          resourceId,
          progressPercent,
        }
      );

    return response.data;

  };