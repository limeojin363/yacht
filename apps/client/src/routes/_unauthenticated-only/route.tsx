import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { useAuth } from "../../auth";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export const Route = createFileRoute("/_unauthenticated-only")({
  component: UnauthenticatedOnlyLayout,
});

function UnauthenticatedOnlyLayout() {
  const { isLoaded, user } = useAuth();
  const router = useRouter();
  const triggered = useRef(false);

  useEffect(() => {
    if (isLoaded) {
      if (user && !triggered.current) {
        toast.warn("이미 로그인되어 있습니다.");
        router.history.back();
      }
      triggered.current = true;
    }
  }, [isLoaded, user, router]);

  if (user) {
    return null;
  }

  return <Outlet />;
}
