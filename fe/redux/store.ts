import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import authReducer from "./auth/auth.slice";
import generalReducer from "./general/general.slice";
import postReducer from "./post/post.slice";
import chaptersReducer from "./chapters/chapters.slice";
import commentsReducer from "./comments/comments.slice";
import { useDispatch } from "react-redux";
import { api } from "./apiSlice";
import { ThunkAction } from "@reduxjs/toolkit";
import { AnyAction } from "redux";
import { State } from "./state";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    general: generalReducer,
    post: postReducer,
    chapters: chaptersReducer,
    comments: commentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, State, unknown, AnyAction>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
