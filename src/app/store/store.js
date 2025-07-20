import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "../home/profileSlice";


export const store = configureStore({
    reducer : {
        profile: profileReducer,
    }
});