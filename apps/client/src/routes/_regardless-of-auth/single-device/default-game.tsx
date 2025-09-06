import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_regardless-of-auth/single-device/default-game',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_regardlessOfAuth/single-mode/default-game"!</div>
}
