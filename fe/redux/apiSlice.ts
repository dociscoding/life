// DO NOT COMMIT SECRETS, API KEYS, OR PRODUCTION URLS TO THIS FILE. USE ENVIRONMENT VARIABLES FOR ALL SENSITIVE DATA.
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";

export const api = createApi({
  reducerPath: "api",
  tagTypes: ["Posts", "Chapters", "Comments"],
  baseQuery: fetchBaseQuery({
    credentials: "include",
    baseUrl: process.env.EXPO_PUBLIC_API_URL || "https://api.chapters.lol", // Use env var or placeholder for open source
    // baseUrl: "http://localhost:3000",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;

      if (token) {
        headers.set("Authorization", token);
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
});
