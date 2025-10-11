import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../auth";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export const Route = createFileRoute("/_authenticated-only")({
  component: AuthenticatedOnlyLayout,
});

function AuthenticatedOnlyLayout() {
  const { user, isLoaded } = useAuth();
  const navigate = useNavigate();
  const toastable = useRef(false);

  useEffect(() => {
    if (isLoaded) {
      if (!user && !toastable.current) {
        toast.warn("로그인이 필요합니다.");
        navigate({ to: "/login", search: { redirect: window.location.href } });
      }
      toastable.current = true;
    }
  }, [isLoaded, user, navigate]);

  if (!user) {
    return <></>;
  }

  return <Outlet />;
}
