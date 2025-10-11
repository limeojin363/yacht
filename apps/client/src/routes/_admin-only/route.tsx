import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { useAuth } from "../../auth";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export const Route = createFileRoute("/_admin-only")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, isLoaded } = useAuth();
  const router = useRouter();
  const toastedRef = useRef(false);

  useEffect(() => {
    if (isLoaded) {
      if ((!user || user.authorityLevel !== 0) && !toastedRef.current) {
        toast.warn("어드민만 접근할 수 있습니다.");
        router.history.back();
      }
      toastedRef.current = true;
    }
  }, [isLoaded, user, router]);

  if (!user || user.authorityLevel !== 0) {
    return null;
  }

  return <Outlet />;
}
