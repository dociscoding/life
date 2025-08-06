import { PayloadAction } from "@reduxjs/toolkit";
import { AuthReducerType, User } from "./auth.types";
import * as SecureStore from "expo-secure-store";

export const setCredentialsAction = (
  state: AuthReducerType,
  action: PayloadAction<{ user: User; token: string }>
) => {
  SecureStore.setItemAsync("accessToken", action.payload.token);

  state.user = action.payload.user;
  state.accessToken = action.payload.token;
};

export const setCredentialsAccessTokenAction = (
  state: AuthReducerType,
  action: PayloadAction<string>
) => {
  state.accessToken = action.payload;
};

export const setCredentialsRefreshTokenAction = (
  state: AuthReducerType,
  action: PayloadAction<string>
) => {
  state.refreshToken = action.payload;
};

export const clearAuthAction = (state: AuthReducerType) => {
  state.accessToken = "";
  state.refreshToken = "";
  state.user = {
    user_id: 0,
    username: "",
    password: "",
    email: "",
    created_at: "",
    updated_at: "",
    bio: "",
    avatar: "",
    name: "",
    role: "user",
  };

  SecureStore?.deleteItemAsync("accessToken");
  SecureStore?.deleteItemAsync("refreshToken");
};
