import { createSlice } from "@reduxjs/toolkit";
import {
  setCredentialsAction,
  setCredentialsAccessTokenAction,
  setCredentialsRefreshTokenAction,
  clearAuthAction,
} from "./auth.actions";
import { AuthReducerType } from "./auth.types";
import { authApi } from "./api/auth.api";
import * as SecureStorage from "expo-secure-store";

const initialState: AuthReducerType = {
  user: {
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
  },
  accessToken: "",
  refreshToken: "",
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: setCredentialsAction,
    setCredentialsAccessToken: setCredentialsAccessTokenAction,
    setCredentialsRefreshToken: setCredentialsRefreshTokenAction,
    clearAuth: clearAuthAction,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.register.matchFulfilled,
      (state, { payload }) => {
        if (payload.ok) {
          state.user.email = payload.email;
        }
      }
    );
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        if (payload.ok) {
          SecureStorage?.setItemAsync(
            "accessToken",
            JSON.stringify(payload.accessToken)
          );
          SecureStorage?.setItemAsync(
            "refreshToken",
            JSON.stringify(payload.refreshToken)
          );
          state.user = payload.user;
          state.accessToken = payload.accessToken;
          state.refreshToken = payload.refreshToken;
        }
      }
    );
    builder.addMatcher(
      authApi.endpoints.signup.matchFulfilled,
      (state, { payload }) => {
        if (payload.ok) {
          SecureStorage?.setItemAsync(
            "accessToken",
            JSON.stringify(payload.accessToken)
          );
          SecureStorage?.setItemAsync(
            "refreshToken",
            JSON.stringify(payload.refreshToken)
          );
          state.user = payload.user;
          state.accessToken = payload.accessToken;
          state.refreshToken = payload.refreshToken;
        }
      }
    );
    builder.addMatcher(
      authApi.endpoints.tokenAuth.matchFulfilled,
      (state, { payload }) => {
        if (payload.ok) {
          state.user = payload.user;
        }
      }
    );
    builder.addMatcher(
      authApi.endpoints.refreshToken.matchFulfilled,
      (state, { payload }) => {
        if (payload.ok) {
          SecureStorage?.setItemAsync(
            "accessToken",
            JSON.stringify(payload.accessToken)
          );
          state.accessToken = payload.accessToken;
        }
      }
    );
    builder.addMatcher(
      authApi.endpoints.editUser.matchFulfilled,
      (state, { payload }) => {
        if (payload.ok) {
          state.user = payload.user;
        }
      }
    );
  },
});

export const {
  setCredentials,
  setCredentialsAccessToken,
  setCredentialsRefreshToken,
  clearAuth,
} = slice.actions;

export default slice.reducer;
