import store from "@store/store";
import {
    setUser as setUserReducer,
    logOut as logOutReducer,
} from "./userSlice";

const setUser = (user) => {
    store.dispatch(setUserReducer(user));
};

const logOut = () => {
    store.dispatch(logOutReducer());
};

const isAuth = () => {
    return store.getState().user.isAuth;
};

export default {
    setUser,
    isAuth,
    logOut,
};
