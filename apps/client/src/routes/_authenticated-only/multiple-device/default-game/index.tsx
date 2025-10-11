import { createFileRoute } from '@tanstack/react-router'
import ListPage from './-components/page'

export const Route = createFileRoute(
  '/_authenticated-only/multiple-device/default-game/',
)({
  component: ListPage,
})
