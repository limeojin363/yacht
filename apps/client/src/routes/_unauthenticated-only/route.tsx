import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_unauthenticated-only')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_unauthenticated-only"!</div>
}
