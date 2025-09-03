import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_regardless-of-auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_regardless-of-auth"!</div>
}
