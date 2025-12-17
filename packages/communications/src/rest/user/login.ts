import { z } from "zod";
import { UserRowSchema } from "../../db/index.js";

export const LoginReqBodySchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const LoginResBodySchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: UserRowSchema.pick({
    id: true,
    name: true,
    authorityLevel: true,
  }),
});
