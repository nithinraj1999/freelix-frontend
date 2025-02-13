import freelancerInstance from "../axiosInstance/freelancerInstance";
import { setAccessToken } from "../axiosInstance/userInstance";

export interface Freelancer{
    name:string;
    description:string;
    skills:string[];
    languages:string[];
    educations:string[]
}

export const createFreelancerAccount = async (data: FormData) => {  
    const response = await freelancerInstance.post("/create-freelancer-account", data, {
      headers: {
        'Content-Type': 'multipart/form-data', // header for file uploads
      },
    });
    return response.data;
  };



  export const switchToBuying = async(userID:string)=>{
    const data = {
      userID :userID
    }
    const response =  await freelancerInstance.post("/switch-to-buying",data)
    console.log(response);
    
    const { accessToken } = response.data;
    setAccessToken(accessToken);
    return response.data
  }


  
  export const switchToSelling = async(userID:string)=>{
    const data = {
      userID :userID
    }
    const response =  await freelancerInstance.post("/switch-to-selling",data)
    console.log(response);

    const { accessToken } = response.data;
    setAccessToken(accessToken);
    return response.data
  }


  export const getJobList = async (query: string,data:object) => {
    console.log("data...",data);
    
    const response = await freelancerInstance.post(`/job-list?${query}`,data);
    return response.data;
  };
  

  export const editFreelancerProfile = async (data: any) => {
    try {
     
      const response = await freelancerInstance.put("/profile/edit", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error while editing freelancer profile:", error);
      throw error; 
    }
  };

  
  export const getJobDetails = async (data: any) => {
    try {
      const response = await freelancerInstance.post("/job-detils",data)
      return response.data;
    } catch (error) {
      console.error("Error while editing freelancer profile:", error);
      throw error;  // You can handle the error as needed
    }
  };
  

  export const submitBid =async (data:any)=>{
    try{
      const response = await freelancerInstance.post("/submit-bid",data)
      return response.data;
    }catch(error){
      console.error(error);
      throw error
      
    }
  }

  export const isBidAlreadyBid = async (jobId:string,userId:string )=>{
    try{
      console.log("services");
      
      const data = {
        jobId,
        userId
      }
      const response = await freelancerInstance.post("/check-for-existing-bidder",data)      
      return response.data;
    }catch(error){
      console.error(error);
      
    }
  }


  export const fetchAllBids = async(data:object)=>{
    try{
      const allBids = await freelancerInstance.post("/all-bids", data);
      return allBids.data
    }catch(error){
      console.error(error);
    }
  }

  export const editMyBid = async(data:object)=>{
    try{
      const editedBid = await freelancerInstance.put("/edit-my-bid", data);
      return editedBid.data
    }catch(error){
      console.error(error);
    }
  }



  export const myBids  = async (data:object)=>{
    try{
      const allMyBids = await freelancerInstance.post("/my-bids",data);
      return allMyBids.data
    }catch(error){
      console.error(error);
      
    }
  }

  export const getBidDetails = async (data:object)=>{
    try{
      const bidDetails = await freelancerInstance.post("/my-bids/details",data);
      return bidDetails.data
    }catch(error){
      console.error(error);
      
    }
  }

  export const withdrawMyBid = async (data:object)=>{
    try{
      const withdrawBid = await freelancerInstance.post("/withdraw-my-bid",data);
      return withdrawBid.data
    }catch(error){
      console.error(error);
      
    }
  }

  

  export const fetchfreelancerDetails = async (data:object)=>{
    try{
      const freelancer = await freelancerInstance.post("/freelancer-details",data);
      return freelancer.data
    }catch(error){
      console.error(error);
      
    }
  }

  export const deletePortFolio = async (data:object)=>{
    try{
      const response = await freelancerInstance.post("/delete-portfolio",data);
      return response.data
    }catch(error){
      console.error(error);
      
    }
  }


  export const fetchOrders = async (data:object)=>{
    try{
      
      const response = await freelancerInstance.post("/my-orders",data);
      console.log(response.data);
      
      return response.data
    }catch(error){
      console.error(error);
    }
  }


  export const completeOrder = async (data:object)=>{
    try{
      console.log(data);
      
      const response = await freelancerInstance.post("/complete-order",data,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      return response.data
    }catch(error){
      console.error(error);
      
    }
  }

  export const fetchReviews = async (data:object)=>{
    try{
      
      const response = await freelancerInstance.post("/fetch-reviews",data);
      console.log(response.data);
      return response.data
    }catch(error){
      console.error(error);
      
    }
  }

  export const fetchWalletInfo = async (data:object)=>{
    try{
      
      const response = await freelancerInstance.post("/fetch-wallet",data);
      console.log(response.data);
      return response.data
    }catch(error){
      console.error(error);
      
    }
  }

  export const getDashboardData = async (data:object)=>{
    try{
      
      const response = await freelancerInstance.post("/get-dashboard-data",data);
      console.log(response.data);
      return response.data
    }catch(error){
      console.error(error);
      
    }
  }

  export const fetchAllSkills = async ()=>{
    try{
      
      const response = await freelancerInstance.get("/get-all-skills");
      console.log(response.data);
      return response.data
    }catch(error){
      console.error(error);
      
    }
  }