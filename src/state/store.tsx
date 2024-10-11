import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import adminReducer from "./slices/adminSlice"

const store = configureStore({
    reducer: {
        user: userReducer,
        admin:adminReducer,
    }
});

// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
