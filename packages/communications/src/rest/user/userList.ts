import { z } from "zod";
import { UserRowSchema } from "../../db/index.js";

export const GetUserListReqBodySchema = z.object({});

export const GetUserListResBodySchema = z.object({
  users: UserRowSchema.pick({
    id: true,
    name: true,
    authorityLevel: true,
  }).array(),
});
