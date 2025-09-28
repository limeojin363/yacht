import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated-only")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
