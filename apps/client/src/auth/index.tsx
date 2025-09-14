import { createContext, use, useState } from "react";
import { useMutation } from "@tanstack/react-query";

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
  logout: () => void;
};

const AuthContext = createContext<AuthInfo | null>(null);

const DUMMY_USER: UserInfo = {
  id: 1,
  username: "dummyUser",
  authority_level: 1,
  g_connected: false,
  g_id: null,
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(DUMMY_USER);
  // const [user, setUser] = useState<UserInfo | null>(null);

  const { mutateAsync: login } = useMutation({
    mutationFn: async ({ username, password }: Credentials) => {
      // Implement login logic
    },
    onSuccess: () => {},
  });

  const { mutateAsync: logout } = useMutation({
    mutationFn: async () => {
      // Implement logout logic
    },
    onSuccess: () => {},
  });

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = use(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };