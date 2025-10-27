import { createFileRoute } from "@tanstack/react-router";
import AdminPage from "./-components/page";

export const Route = createFileRoute("/_admin-only/admin/")({
  component: AdminPage,
});
