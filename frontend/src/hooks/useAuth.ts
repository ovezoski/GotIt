import type { AuthContextType } from "@/types/auth";
import { createContext, useContext } from "react";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext) as AuthContextType | undefined;

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
