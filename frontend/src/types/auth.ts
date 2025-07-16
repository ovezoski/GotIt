import type { AxiosResponse } from "axios";
import type { ReactNode } from "react";

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface UserPayload {
  user_id: number;
  username: string;
  email?: string;
  exp: number;
  iat: number;
  jti: string;
  token_type: string;
}

export interface AuthContextType {
  user: UserPayload | null;
  authTokens: AuthTokens | null;
  loginUser: (
    username: string,
    password: string
  ) => Promise<AxiosResponse<AuthTokens>>;
  registerUser: (
    username: string,
    email: string,
    password: string,
    password2: string
  ) => Promise<AxiosResponse<UserPayload>>;
  logoutUser: () => void;
  loading: boolean;
}

export interface AuthProviderProps {
  children: ReactNode;
}
