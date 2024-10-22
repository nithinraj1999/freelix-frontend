import adminInstance from "../axiosInstance/adminInstance";
import { setAccessToken } from "../axiosInstance/adminInstance";
import { LoginData,Admin } from "./interfaces/IAdminApi";


  export interface LoginResponse {
    success: boolean;
    admin?: Admin;
    message:string;
  }


export const loginAdmin= async (data: LoginData): Promise<LoginResponse> => {
    try {
      const response = await adminInstance.post("/login", data);
      const { accessToken } = response.data;
      setAccessToken(accessToken);
      return response.data;
    } catch (error) {
      console.error(error);
      return { success: false,message:"user not found" };
    }
  };
  