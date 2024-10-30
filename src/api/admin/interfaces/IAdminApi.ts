export interface LoginData {
    email: string;
    password: string;
  }

export interface Admin {
    id: string;
    name: string;
    email: string;
    phone:number;
    role:string;
    profilePicture?:string;
    isBlock:boolean;
    isVerified:boolean;
}
  

  