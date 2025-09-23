import { createContext, use, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Login } from "../apis/services/user/login";
import { Signup } from "../apis/services/user/signup";

type UserInfo = {
  id: number;
  username: string;
  authority_level: 0 | 1 | 2 | 3;
  g_connected: boolean;
  g_id: number | null;
};

type Credentials = { username: string; password: string };

export type AuthInfo = {
  user: UserInfo | null;
  login: (credentials: Credentials) => void;
  signup: (credentials: Credentials) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthInfo | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const { mutateAsync: login } = useMutation({
    mutationFn: async ({ username, password }: Credentials) => {
      const res = await Login({ username, password });
      return res.json();
    },
    onSuccess: ({ user, accessToken, refreshToken }) => {
      console.log("Login Success!");
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", JSON.stringify(accessToken));
      localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
      window.location.href = "/";
    },
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  const { mutateAsync: signup } = useMutation({
    mutationFn: async ({ username, password }: Credentials) => {
      const res = await Signup({ username, password });
      return res.json();
    },
    onSuccess: ({ user, accessToken, refreshToken }) => {
      console.log("Signup Success!");
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", JSON.stringify(accessToken));
      localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
      window.location.href = "/";
    },
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  const { mutateAsync: logout } = useMutation({
    mutationFn: async () => {
      // Implement logout logic
    },
    onSuccess: () => {},
  });

  const value = { user, login, logout, signup };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = use(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
