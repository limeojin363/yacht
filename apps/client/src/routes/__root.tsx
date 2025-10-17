import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AuthProvider, type AuthInfo } from "../auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface MyRouterContext {
  auth: AuthInfo;
}

const CheckProvider = ({ children }: { children: React.ReactNode }) => {
  // useCheck();
  return children;
};

const Component = () => {
  return (
    <AuthProvider>
      <CheckProvider>
        <Outlet />
        <TanStackRouterDevtools />
        <ToastContainer
          autoClose={2000}
          limit={3}
          closeButton={false}
          closeOnClick
          hideProgressBar
        />
      </CheckProvider>
    </AuthProvider>
  );
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Component,
});
