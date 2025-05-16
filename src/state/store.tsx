import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import adminReducer from "./slices/adminSlice"
import notificationsReducer from './slices/notificationSlice'
const store = configureStore({
    reducer: {
        user: userReducer,
        admin:adminReducer,
        notifications: notificationsReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
