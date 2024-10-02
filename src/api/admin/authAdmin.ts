import adminInstance from "../axiosInstance/adminInstance";
import { setAccessToken } from "../axiosInstance/adminInstance";


interface LoginData {
    email: string;
    password: string;
  }


  
interface Admin {
    id: string;
    name: string;
    email: string;
    phone:number;
    role:string;
    profilePicture?:string;
    isBlock:boolean;
    isVerified:boolean;
  }
  
  export interface LoginResponse {
    success: boolean;
    admin?: Admin;
    message:string;
  }



  
export const loginAdmin= async (data: LoginData): Promise<LoginResponse> => {
    try {
      const response = await adminInstance.post("/login", data);
      const { accessToken } = response.data;
      console.log("access...",accessToken);
      
      setAccessToken(accessToken);
      return response.data;
    } catch (error) {
      console.error(error);
      return { success: false,message:"user not found" };
    }
  };
  