import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_regardless-of-auth")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
