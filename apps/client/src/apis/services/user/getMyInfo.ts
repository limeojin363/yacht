import type { ResponsePromise } from "ky";
import authenticatedApiClient from "../../core/clients";
import { type GetMyInfoResBodySchema } from "@yacht/communications";
import type z from "zod";

type GetMyInfoType = () => ResponsePromise<{ data: z.infer<typeof GetMyInfoResBodySchema> }>;

export const GetMyInfo: GetMyInfoType = () =>
  authenticatedApiClient.get("user/me", {});
