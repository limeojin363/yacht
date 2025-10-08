import type { ResponsePromise } from "ky";
import authenticatedApiClient from "../../core/clients";
import {
  type DeleteGameReqBody,
  type DeleteGameResBody,
} from "@yacht/communications";

type DeleteGameType = (
  b: DeleteGameReqBody
) => ResponsePromise<{ data: DeleteGameResBody }>;

export const DeleteGame: DeleteGameType = ({ id }) =>
  authenticatedApiClient.delete(`game/${id}`);
