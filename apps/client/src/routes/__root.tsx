import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { type AuthInfo } from "../auth";
import Header from "../components/layouts/Header";

interface MyRouterContext {
  auth: AuthInfo;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Header/>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
