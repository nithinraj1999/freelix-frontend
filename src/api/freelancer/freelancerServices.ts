import freelancerInstance from "../axiosInstance/freelancerInstance";


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
    return response.data
  }


  
  export const switchToSelling = async(userID:string)=>{
    const data = {
      userID :userID
    }
    const response =  await freelancerInstance.post("/switch-to-selling",data)
    return response.data
  }


    
  export const getJobList = async()=>{
    const response =  await freelancerInstance.get("/job-list")
    return response.data
  }


  export const editFreelancerProfile = async (data: any) => {
    try {
      const response = await freelancerInstance.post("/profile/edit", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error while editing freelancer profile:", error);
      throw error;  // You can handle the error as needed
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
      console.log(response);
      
      return response.data;
    }catch(error){
      console.error(error);
      
    }
  }