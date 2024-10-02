import userInstance from "../axiosInstance/userInstance";

export const registerUser = async (data: object) => {
  try {
    const response = await userInstance.post("/signup", data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const verifyOTP = async (otp: object) => {
  try {
    const response = await userInstance.post("/verification", otp);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

interface LoginData {
  email: string;
  password: string;
}


interface User {
  _id: string;
  name: string;
  email: string;
  phone:number;
  role:string;
  profilePicture?:string;
  isBlock:boolean;
  isVerified:boolean;
  hasFreelancerAccount:boolean;
  isFreelancerBlock:boolean;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  message:string;
}

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const response = await userInstance.post("/login", data);
    return response.data;
  } catch (error) {
    console.error(error);
    return { success: false,message:"user not found" };
  }
};



export const resendOTP = async (data:object): Promise<string | { success: boolean; message: string }> => {
  try {
    
    const response = await userInstance.post("/resend-otp",data);
    return response.data;
  } catch (error) {
    console.error(error);
    return { success: false, message: "failed to resend otp" };
  }
};
