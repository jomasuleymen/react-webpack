import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: {},
        isAuth: false
    },
    reducers: {
        setUser: (state, { payload }) => {
            state.currentUser = payload;
            state.isAuth = true;
        },
        logOut: (state) => {
            state.currentUser = {};
            state.isAuth = false;
        }
    },
});

export default userSlice.reducer;
export const { setUser, logOut } = userSlice.actions;
