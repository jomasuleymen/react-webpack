import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./auth/userSlice";
export default configureStore({
    reducer: {
        user: userReducer,
    },
});
