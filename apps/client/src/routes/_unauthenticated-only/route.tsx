import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_unauthenticated-only')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />;
}
