import type { ResponsePromise } from "ky";
import authenticatedApiClient from "../../core/clients";
import { type GetGameListResBody } from "@yacht/communications";

type GetGameListType = () => ResponsePromise<GetGameListResBody>;

export const GetGameList: GetGameListType = () =>
  authenticatedApiClient.get("game/list");
