import { createFileRoute } from '@tanstack/react-router'
import MePage from '../../../pages/me'

export const Route = createFileRoute('/_authenticated-only/me/')({
  component: MePage,
})