import type { ResponsePromise } from "ky";
import authenticatedApiClient from "../../core/clients";
import {
  type EnterGameReqBody,
  type EnterGameResBody,
} from "@yacht/communications";

type EnterGameType = (
  b: EnterGameReqBody,
) => ResponsePromise<{ data: EnterGameResBody }>;

export const EnterTheGame: EnterGameType = (body) =>
  authenticatedApiClient.post("game/enter", { json: body });
