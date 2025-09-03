import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated-only/user/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated-only/user/"!</div>
}
