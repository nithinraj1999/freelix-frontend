import { createSlice, PayloadAction } from "@reduxjs/toolkit";



export interface PortfolioItem {
  image: string;
  title: string;
  description:string;
}
interface User {
  _id: string;
  name: string;
  email: string;
  phone:number;
  title:string;
  description:string;
  skills:string[];
  hasFreelancerAccount:boolean;
  role:string;
  profilePicture?:string;
  isBlock:boolean;
  isVerified:boolean;
  isFreelancerBlock:boolean;
  portfolio?:PortfolioItem[];
}


interface UserState {
  user: User | null;
  login: boolean;
}


const storedUserInfo = localStorage.getItem('userData');


const initialState: UserState = {
  user: storedUserInfo ? JSON.parse(storedUserInfo) : null,
  login: storedUserInfo ? true : false,
};

const userSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    userLogin: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.login = true;
      localStorage.setItem('userData', JSON.stringify(action.payload));
    },

    userLogout: (state) => {
      state.user = null;
      state.login = false;
      localStorage.removeItem('userData');
    },
    

    updateUserBlockStatus: (state, action: PayloadAction<{ userId: string; isBlock: boolean }>) => {
    
      if (state.user && state.user._id === action.payload.userId) {

        state.user.isBlock = action.payload.isBlock;
        localStorage.setItem('userData', JSON.stringify(state.user));
      }
    },
    
    updateFreelancerBlockStatus: (state, action: PayloadAction<{ userId: string; isFreelancerBlock: boolean,role:string }>) => {
      if (state.user && state.user._id === action.payload.userId) {
        state.user.isFreelancerBlock = action.payload.isFreelancerBlock;
        state.user.role =  action.payload.role;
        localStorage.setItem('userData', JSON.stringify(state.user)); 
      }
    } 
  }
});


export const { userLogin, userLogout,updateUserBlockStatus,updateFreelancerBlockStatus } = userSlice.actions;
export const isLogin = (state: { user: UserState }) => state.user.login;
export default userSlice.reducer;
