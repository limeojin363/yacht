import { createFileRoute } from '@tanstack/react-router'
import AdminPage from '../../pages/admin'

export const Route = createFileRoute('/_admin-only/admin')({
  component: AdminPage,
})
