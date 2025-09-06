import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_regardless-of-auth/single-device/altered-game',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_regardlessOfAuth/single-mode/altered-game"!</div>
}
