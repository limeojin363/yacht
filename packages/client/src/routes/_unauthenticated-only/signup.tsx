import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_unauthenticated-only/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_unauthenticated-only/signup"!</div>
}
