import { z } from "zod";
import { UserRowSchema } from "../../db/index.js";

export const SignupReqBodySchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const SignupResBodySchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: UserRowSchema.pick({
    id: true,
    name: true,
    authorityLevel: true,
  }),
});
