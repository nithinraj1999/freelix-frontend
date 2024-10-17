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
      console.log(data);
      
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
  