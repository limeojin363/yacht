import { createContext, use, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Login } from "../apis/services/user/login";
import { Signup } from "../apis/services/user/signup";
import type { LoginResBody, SignupResBody } from "@yacht/communications";
import { useNavigate } from "@tanstack/react-router";

type Credentials = { username: string; password: string };

type UserInfo = {
  id: number;
  username: string;
  authorityLevel: 0 | 2 | 1;
  gamePlayerId: number | null;
  gameId: number | null;
};

export type AuthInfo = {
  user: UserInfo | null;
  isLoaded: boolean;
  login: (credentials: Credentials) => Promise<{ data: LoginResBody } | void>;
  signup: (credentials: Credentials) => Promise<{ data: SignupResBody } | void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthInfo>({
  user: null,
  isLoaded: false,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoaded(true);
  }, [setIsLoaded]);

  const { mutateAsync: login } = useMutation({
    mutationFn: async ({ username, password }: Credentials) => {
      const res = await Login({ username, password });
      return res.json();
    },
    onSuccess: ({ data }) => {
      console.log("Login Success!");
      navigate({ to: "/" });
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
      localStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));
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
    onSuccess: ({ data }) => {
      console.log("Signup Success!");
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
      localStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));
      navigate({ to: "/" });
    },
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  const { mutateAsync: logout } = useMutation({
    mutationFn: async () => {
      navigate({ to: "/" });
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
    },
    onSuccess: () => {},
  });

  const value: AuthInfo = { user, login, logout, signup, isLoaded };

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
