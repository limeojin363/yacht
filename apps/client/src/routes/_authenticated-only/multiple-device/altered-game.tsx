import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated-only/multiple-device/altered-game')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticatedOnly/a"!</div>
}
