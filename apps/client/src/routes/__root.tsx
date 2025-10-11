import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AuthProvider, type AuthInfo } from "../auth";
import useCheck from "../hooks/useCheck";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface MyRouterContext {
  auth: AuthInfo;
}

const Component = () => {
  useCheck();

  return (
    <AuthProvider>
      <Outlet />
      <TanStackRouterDevtools />
      <ToastContainer
        autoClose={2000}
        limit={3}
        closeButton={false}
        closeOnClick
        hideProgressBar
      />
    </AuthProvider>
  );
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Component,
});
