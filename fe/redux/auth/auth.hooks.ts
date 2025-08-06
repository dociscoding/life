import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "./auth.selector";
import * as SecureStorage from "expo-secure-store";
import { useAppDispatch } from "../store";
import {
  setCredentialsAccessToken,
  setCredentialsRefreshToken,
} from "./auth.slice";
import { useEditUserMutation } from "./api/auth.api";
import { useDeleteUserMutation } from "./api/auth.api";
import { UpdateUserRequest } from "./api/auth.api.types";
import { logout } from "@/redux/auth/auth.side";

export const useAuth = () => {
  const user = useSelector(selectCurrentUser);
  const { accessToken, refreshToken } = useSelector(selectCurrentToken);

  return useMemo(
    () => ({ user, accessToken, refreshToken }),
    [user, accessToken, refreshToken]
  );
};

export const useToken = () => {
  const dispatch = useAppDispatch();

  SecureStorage?.getItemAsync("accessToken").then((result) => {
    if (result) {
      const token = JSON.parse(result);
      dispatch(setCredentialsAccessToken(token));
    }
  });

  SecureStorage?.getItemAsync("refreshToken").then((result) => {
    if (result) {
      const token = JSON.parse(result);
      dispatch(setCredentialsRefreshToken(token));
    }
  });
};

export const useEditProfile = () => {
  const dispatch = useAppDispatch();
  const [editProfileMutation] = useEditUserMutation();

  const editProfile = async (formData: FormData) => {
    const requestData: UpdateUserRequest = formData;

    try {
      console.log("sending data:", formData);
      const response = await editProfileMutation(requestData).unwrap();

      if (response.ok !== false && response.user) {
        return response.user;
      } else {
        throw new Error(response.message || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  return { editProfile };
};

export const useDeleteProfile = () => {
  const dispatch = useAppDispatch();
  const [deleteProfileMutation] = useDeleteUserMutation();

  const deleteProfile = async () => {
    try {
      await deleteProfileMutation().unwrap();
      await dispatch(logout());
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  };

  return { deleteProfile };
};
