import type { ResponsePromise } from "ky";
import { baseApiClient } from "../../../core/clients";
import {
  type LoginReqBody,
  type LoginResBody,
} from "@yacht/communications";

type LoginType = (
  _: LoginReqBody
) => ResponsePromise<LoginResBody>;

export const Login: LoginType = (data) =>
  baseApiClient.post("auth/login", { json: data });
