import { createFileRoute } from "@tanstack/react-router";
import ListPage from "../../../pages/games/DefaultGame_MultipleDevice/ListPage";

export const Route = createFileRoute(
  "/_authenticated-only/multiple-device/default-game/"
)({
  component: ListPnavigateage,
});

