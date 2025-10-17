import type { ResponsePromise } from "ky";
import authenticatedApiClient from "../../core/clients";
import { type GetMyInfoResBody } from "@yacht/communications";

type GetMyInfoType = () => ResponsePromise<{ data: GetMyInfoResBody }>;

export const GetMyInfo: GetMyInfoType = () =>
  authenticatedApiClient.get("user/me", {});
