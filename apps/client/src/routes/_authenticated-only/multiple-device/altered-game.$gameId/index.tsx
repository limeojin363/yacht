import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated-only/multiple-device/altered-game/$gameId/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      Hello "/_authenticated-only/multiple-device/altered-game/$gameId/"!
    </div>
  )
}
