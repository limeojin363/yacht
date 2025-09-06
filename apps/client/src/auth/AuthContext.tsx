import { createContext } from "react";
// import { useMutation } from "@tanstack/react-query";

type UserObject = {
  username: string;
  id: number;
  authorityLevel: 0 | 1 | 2 | 3;
  connectedToGame: boolean;
  gameId: number | null;
};

type Credentials = { username: string; password: string };

type AuthContextValue = {
  user: UserObject | null;
  login: (credentials: Credentials) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [value, setValue] = useState<AuthContextValue | null>(null);

//   const { mutateAsync: login } = useMutation({
//     mutationFn: async ({ username, password }: Credentials) => {
//       // Implement login logic
//     },
//     onSuccess: () => {},
//   });

//   const { mutateAsync: logout } = useMutation({
//     mutationFn: async () => {
//       // Implement login logic
//     },
//     onSuccess: () => {},
//   });

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// 로그인된 상태에서 사용
// const useUserInfo = () => {
//   const contextValue = useContext(AuthContext);
//   if (!contextValue)
//     throw new Error("useUserInfo must be used within an AuthProvider");

//   if (!contextValue.user) {
//     throw new Error("User is not authenticated");
//   }

//   return contextValue.user;
// };

export default AuthContext;
