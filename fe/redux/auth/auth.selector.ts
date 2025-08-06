import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectCurrentUser = (state: RootState) => state.auth.user;

export const selectCurrentToken = createSelector(
  (state: RootState) => state,
  (state) => {
    return {
      accessToken: state.auth.accessToken,
      refreshToken: state.auth.refreshToken,
    };
  }
);
