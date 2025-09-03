import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated-only/multiple-device/default-game',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticatedOnly/multiple-device/default-game"!</div>
}
