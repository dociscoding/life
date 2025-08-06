// import { Post } from "../post/post.types";

export interface AuthReducerType {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface User {
  user_id: number;
  username: string;
  password: string; //it's hashed don't worry!
  email: string;
  // emailVerified: boolean;
  // provider: 'email' | 'google' | 'apple';
  created_at: string;
  updated_at: string;
  role: "user" | "tester" | "dev";
  name: string;
  avatar: string;
  bio: string;
  // location: string;
  // posts: Post[];
}
