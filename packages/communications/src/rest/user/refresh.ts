import { z } from "zod";

export const RefreshReqBodySchema = z.object({
  refreshToken: z.string(),
});

export const RefreshResBodySchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});
