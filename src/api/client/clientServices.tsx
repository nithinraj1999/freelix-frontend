import userInstance from "../axiosInstance/userInstance";

export const createJobPost = async (data: object) => {
  try {
    const response = await userInstance.post("/create-job-post", data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
    return response.data;
  } catch (error) {
    console.error(error);
  }
};