import adminInstance from "../axiosInstance/adminInstance";


  
// interface Admin {
//     id: string;
//     name: string;
//     email: string;
//     phone:number;
//     role:string;
//     profilePicture?:string;
//     isBlock:boolean;
//     isVerified:boolean;
//   }
  


  
export const getAllClientData= async (page: number, limit: number): Promise<any> => {
    try {

      const response = await adminInstance.get(`/clients-details?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return { success: false,message:"user not found" };
    }
  };

  

  
export const blockClient= async (clientID:string): Promise<any> => {
    try {
        const data = {
            clientID:clientID
        }
      const response = await adminInstance.post("/block-client",data);
      return response.data;
    } catch (error) {
      console.error(error);
      return { success: false,message:"user not found" };
    }
  };

  
export const unblockClient = async (clientID:string): Promise<any> => {
    try {
        const data = {
            clientID:clientID
        }
      const response = await adminInstance.post("/unblock-client",data);
      return response.data;
    } catch (error) {
      console.error(error);
      return { success: false,message:"user not found" };
    }
  };
  


  export const createUser = async (data:object):Promise<any> =>{
    try{
      const response = await adminInstance.post("/create-user", data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data
    }catch(error){
      console.error(error);
      
    }
  }

  export const editUser = async (data:object):Promise<any> =>{
    try{
      const response = await adminInstance.post("/edit-user", data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data
    }catch(error){
      console.error(error);
      
    }
  }



  export const getAllFreelancerData = async (): Promise<any> => {
    try {
      const response = await adminInstance.get("/freelancers-details");
      return response.data;
    } catch (error) {
      console.error(error);
      return { success: false, message: "No freelancers found" };
    }
  };
  
  export const blockFreelancer = async (freelancerID: string): Promise<any> => {
    try {
      const data = {
        freelancerID: freelancerID,
      };
      const response = await adminInstance.post("/block-freelancer", data);
      return response.data;
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to block freelancer" };
    }
  };
  
  export const unblockFreelancer = async (freelancerID: string): Promise<any> => {
    try {
      const data = {
        freelancerID: freelancerID,
      };
      const response = await adminInstance.post("/unblock-freelancer", data);
      return response.data;
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to unblock freelancer" };
    }
  };
  
  export const createFreelancer = async (data: object): Promise<any> => {
    try {
      const response = await adminInstance.post("/create-freelancer", data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to create freelancer" };
    }
  };
  
  export const editFreelancer = async (data: object): Promise<any> => {
    try {

      const response = await adminInstance.post("/edit-freelancer", data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to edit freelancer" };
    }
  };


  export const refreshAccessToken = async () => {
    try {
        const response = await adminInstance.get(`/refresh-token`, {
            withCredentials: true, // To include cookies for HttpOnly refresh token
        });
        const { accessToken } = response.data;
        
        if (!accessToken) {
            throw new Error('No access token returned from refresh token endpoint');
        }
        localStorage.setItem('accessToken', accessToken); // Store new access token in localStorage
        return accessToken;
    } catch (error) {
        // More detailed logging
        if (error) {
            console.error('Failed to refresh access token:', error);
        } else {
            console.error('Failed to refresh access token:', error);
        }
        throw error; // Propagate the error
    }
};


export const addSkills = async (data:any)=>{
  try{
    const response =  await adminInstance.post("/add-skills",data)
    return response.data
  }catch(error){
    console.error(error);
  }
}


export const dashboardData = async ()=>{
  try{
    const response =  await adminInstance.get("/dashboard-data")
    return response.data
  }catch(error){
    console.error(error);
  }
}


export const fetchAllSkills = async ()=>{
  try{
    const response =  await adminInstance.get("/get-all-skills")
    return response.data
  }catch(error){
    console.error(error);
  }
}

  