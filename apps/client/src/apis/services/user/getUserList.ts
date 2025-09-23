import type { ResponsePromise } from "ky";
import authenticatedApiClient from "../../core/clients";
import { type GetUserListResBody } from "@yacht/communications";

type GetUserListType = () => ResponsePromise<GetUserListResBody>;

export const GetUserList: GetUserListType = () =>
  authenticatedApiClient.get("user/list");
