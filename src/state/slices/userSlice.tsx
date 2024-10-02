import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  name: string;
  email: string;
  phone:number;
  hasFreelancerAccount:boolean;
  role:string;
  profilePicture?:string;
  isBlock:boolean;
  isVerified:boolean;
  isFreelancerBlock:boolean;
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
    
    // New action to handle block/unblock
    updateUserBlockStatus: (state, action: PayloadAction<{ userId: string; isBlock: boolean }>) => {
      if (state.user && state.user._id === action.payload.userId) {
        state.user.isBlock = action.payload.isBlock;
        localStorage.setItem('userData', JSON.stringify(state.user)); // Persist the updated block status
      }
    },
    updateFreelancerBlockStatus: (state, action: PayloadAction<{ userId: string; isFreelancerBlock: boolean }>) => {
      if (state.user && state.user._id === action.payload.userId) {
        state.user.isFreelancerBlock = action.payload.isFreelancerBlock;
        localStorage.setItem('userData', JSON.stringify(state.user)); // Persist the updated block status
      }
    } 
  }
});


export const { userLogin, userLogout,updateUserBlockStatus,updateFreelancerBlockStatus } = userSlice.actions;
export const isLogin = (state: { user: UserState }) => state.user.login;
export default userSlice.reducer;
