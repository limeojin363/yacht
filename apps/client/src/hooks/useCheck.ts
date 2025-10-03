import { useQuery } from "@tanstack/react-query";
import { GetMyInfo } from "../apis/services/user/getMyInfo";
import { useLocation, useNavigate } from "@tanstack/react-router";
import useToast from "./useToast";
import { useAuth } from "../auth";
import { useEffect } from "react";

const useCheck = () => {
  const pathname = useLocation({ select: (location) => location.pathname });
  const navigate = useNavigate();
  const { triggerToast } = useToast();
  const { user } = useAuth();

  const { refetch } = useQuery({
    queryKey: ["check"],
    queryFn: async () => {
      if (!user) return null;
    if (regexp.test(pathname)) return null;

      const res = await GetMyInfo();
      const { g_id } = await res.json();
      if (g_id) {
        navigate({
          to: "/multiple-device/default-game/$gameId",
          params: { gameId: String(g_id) },
        });
        triggerToast("참여 중인 게임으로 이동합니다.");
      }
      return true;
    },
  });

  useEffect(() => {
    refetch();
  }, [pathname, refetch]);
};

// /multiple-device/default-game/숫자
const regexp = /^\/multiple-device\/default-game\/\d+$/;

export default useCheck;
