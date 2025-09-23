import type { ResponsePromise } from "ky";
import { baseApiClient } from "../../core/clients";
import {
  type RefreshReqBody,
  type RefreshResBody,
} from "@yacht/communications";

type TRefresh = (
  _: RefreshReqBody
) => ResponsePromise<RefreshResBody>;

export const Refresh: TRefresh = (data) =>
  baseApiClient.post("user/refresh", { json: data });
