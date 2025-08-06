import authSlice from "./auth/auth.slice";
import generalSlice from "./general/general.slice";
import postSlice from "./post/post.slice";
import chaptersSlice from "./chapters/chapters.slice";
import commentsSlice from "./comments/comments.slice";

export type State = {
  auth: ReturnType<typeof authSlice>;
  general: ReturnType<typeof generalSlice>;
  post: ReturnType<typeof postSlice>;
  chapters: ReturnType<typeof chaptersSlice>;
  comments: ReturnType<typeof commentsSlice>;
};
