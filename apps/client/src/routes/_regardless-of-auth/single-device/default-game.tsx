import { createFileRoute } from "@tanstack/react-router";
import DefaultGame_SingleDevice from "../../../pages/games/DefaultGame_SingleDevice";

export const Route = createFileRoute(
  "/_regardless-of-auth/single-device/default-game"
)({
  component: () => <DefaultGame_SingleDevice />,
});
