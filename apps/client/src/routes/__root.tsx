import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { type AuthInfo } from "../auth";
import Header from "../components/layouts/Header";
import useToast from "../hooks/useToast";
import useCheck from "../hooks/useCheck";

interface MyRouterContext {
  auth: AuthInfo;
}

const Component = () => {
  const { ToastComponent } = useToast();
  useCheck();

  return (
    <>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
      <ToastComponent />
    </>
  );
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Component,
});
