import userInstance from "../axiosInstance/userInstance";
import {loadStripe} from '@stripe/stripe-js';

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


export const selectedJobDetails =async (data:object)=>{
  try {
    const response = await userInstance.post("/my-job-details", data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}


export const fetchAllBids = async(data:object)=>{
  try{
    const allBids = await userInstance.post("/all-bids", data);
    return allBids.data
  }catch(error){
    console.error(error);
    
  }
}


export const fetchfreelancerDetails = async (data:object)=>{
  try{
    const freelancer = await userInstance.post("/freelancer-details",data);
    return freelancer.data
  }catch(error){
    console.error(error);
    
  }

}


export const fetchAllNotifications = async (data:object)=>{
  try{
    const notifications = await userInstance.post("/all-notifications",data);
    return notifications.data
  }catch(error){
    console.error(error);
  }

}

export const fetchSkills = async ()=>{
  try{
    const response = await userInstance.get("/get-skills");
    
    return response.data
  }catch(error){
    console.error(error);
  }

}


export const gotoCheckout = async(data:object)=>{
  try{
    const stripe  = await loadStripe("pk_test_51QIqFWLXI5UC7UZcNNLpIxqjCRdLjGKpuL15U7Wt9tYu3hYn6DivvAd3DDSbaE49dlAeGZFrY2gYRBt6kX3vNxW400wvP8Zw16")
    const response = await userInstance.post("/make-payment",data);
    const session = response.data
    let result = stripe?.redirectToCheckout({
      sessionId:session.id
    })

  }catch(error){
    throw error
  }
}

