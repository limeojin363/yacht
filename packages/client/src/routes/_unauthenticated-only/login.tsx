import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_unauthenticated-only/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_unauthenticated-only/login"!</div>
}
