import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Admin{
  id: string;
  name: string;
  email: string;
  phone:number;
  role:string;
  profilePicture?:string;
  isBlock:boolean;
  isVerified:boolean;
}


interface AdminState {
  admin: Admin | null;
  login: boolean;
}


const storedUserInfo = localStorage.getItem('adminData');


const initialState: AdminState = {
  admin: storedUserInfo ? JSON.parse(storedUserInfo) : null,
  login: storedUserInfo ? true : false,
};

const adminSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    adminLogin: (state, action: PayloadAction<Admin>) => {
      state.admin = action.payload;
      state.login = true;
      localStorage.setItem('adminData', JSON.stringify(action.payload));
    },

    adminLogout: (state) => {
      state.admin = null;
      state.login = false;
      localStorage.removeItem('adminData');
    }
  }
});


export const { adminLogin, adminLogout } = adminSlice.actions;
export const isLogin = (state: { user: AdminState }) => state.user.login;
export default adminSlice.reducer;
