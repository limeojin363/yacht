import { createFileRoute } from "@tanstack/react-router";
import SignupPage from "./-components/page";

export const Route = createFileRoute("/_unauthenticated-only/signup/")({
  component: SignupPage,
});
