import { createFileRoute } from "@tanstack/react-router";
import MePage from "./-components/page";

export const Route = createFileRoute("/_authenticated-only/me/")({
  component: MePage,
});
