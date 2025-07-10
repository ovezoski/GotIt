import { useState, useEffect, useCallback, type ReactNode } from "react";
import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "@/hooks/useAuth";
import apiClient from "@/api/axiosConfig";
import { toast } from "sonner";

interface AuthTokens {
  access: string;
  refresh: string;
}

interface UserPayload {
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

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() => {
    try {
      const storedTokens = localStorage.getItem("authTokens");
      return storedTokens ? (JSON.parse(storedTokens) as AuthTokens) : null;
    } catch (error) {
      console.error("Failed to parse authTokens from localStorage:", error);
      return null;
    }
  });

  const [user, setUser] = useState<UserPayload | null>(() => {
    try {
      const storedTokens = localStorage.getItem("authTokens");
      if (storedTokens) {
        const parsedTokens: AuthTokens = JSON.parse(storedTokens);
        return jwtDecode<UserPayload>(parsedTokens.access);
      }
      return null;
    } catch (error) {
      console.error(
        "Failed to decode user from authTokens in localStorage:",
        error
      );
      localStorage.removeItem("authTokens");
      return null;
    }
  });

  const [loading, setLoading] = useState<boolean>(true);

  const loginUser = async (username: string, password: string) => {
    try {
      const response = await apiClient.post<AuthTokens>("/api/token/", {
        username,
        password,
      });

      const data: AuthTokens = response.data;

      setAuthTokens(data);
      setUser(jwtDecode<UserPayload>(data.access));

      localStorage.setItem("authTokens", JSON.stringify(data));
      toast.success("Logged In.");
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Log In Failed.");

        console.error(
          "Login failed (AxiosError):",
          error.response?.data || error.message
        );
      } else if (error instanceof Error) {
        console.error("Login failed (Standard Error):", error.message);
      } else {
        console.error("Login failed (Unknown Error):", error);
      }
      throw error;
    }
  };

  const registerUser = async (
    username: string,
    email: string,
    password: string,
    password2: string
  ) => {
    try {
      const response = await apiClient.post("/api/register/", {
        username,
        email,
        password,
        password2,
      });
      await loginUser(username, password);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Registration Failed.");

        console.error(
          "Registration failed (AxiosError):",
          error.response?.data || error.message
        );
      } else if (error instanceof Error) {
        console.error("Registration failed (Standard Error):", error.message);
      } else {
        console.error("Registration failed (Unknown Error):", error);
      }
      throw error;
    }
  };

  const logoutUser = useCallback(() => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
  }, []);

  useEffect(() => {
    const requestInterceptor = apiClient.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (authTokens && !config.url?.includes("/token/")) {
          config.headers.Authorization = `Bearer ${authTokens.access}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
    };
  }, [authTokens]);

  const updateToken = useCallback(async () => {
    if (!authTokens?.refresh) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post<AuthTokens>("/api/token/refresh/", {
        refresh: authTokens.refresh,
      });

      const data: AuthTokens = response.data;
      setAuthTokens(data);
      setUser(jwtDecode<UserPayload>(data.access));

      localStorage.setItem("authTokens", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logoutUser();
    } finally {
      setLoading(false);
    }
  }, [authTokens?.refresh, logoutUser]);

  useEffect(() => {
    const fiveMinutes: number = 1000 * 60 * 5;
    const interval: NodeJS.Timeout = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fiveMinutes);
    return () => clearInterval(interval);
  }, [authTokens, updateToken]);

  useEffect(() => {
    if (loading && authTokens) {
      updateToken();
    } else if (loading) {
      setLoading(false);
    }
  }, [loading, authTokens, updateToken]);

  const contextData: AuthContextType = {
    user,
    authTokens,
    loginUser,
    registerUser,
    logoutUser,
    loading,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
