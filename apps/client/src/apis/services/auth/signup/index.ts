import type { ResponsePromise } from "ky";
import { baseApiClient } from "../../../core/clients";
import {
  type SignupReqBody,
  type SignupResBody,
} from "@yacht/communications";

type SignupT = (
  _: SignupReqBody
) => ResponsePromise<SignupResBody>;

export const Signup: SignupT = (data) =>
  baseApiClient.post("auth/signup", { json: data });
