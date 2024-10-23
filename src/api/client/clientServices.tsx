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

export const getAllJobPosts = async (data: object) => {
  try {
    const response = await userInstance.post("/my-job-posts", data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deletepost = async (data:object)=>{
  try {
    const response = await userInstance.post("/delete-post", data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}



export const editPost = async (data:object)=>{
  try {
    const response = await userInstance.post("/edit-post", data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}