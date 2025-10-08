import type { ResponsePromise } from "ky";
import { baseApiClient } from "../../core/clients";
import { type LoginReqBody, type LoginResBody } from "@yacht/communications";

type LoginType = (_: LoginReqBody) => ResponsePromise<{ data: LoginResBody }>;

export const Login: LoginType = (data) =>
  baseApiClient.post("user/login", { json: data });
