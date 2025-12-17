import { z } from "zod";
import { UserRowSchema } from "../../db/index.js";

export const GetMyInfoResBodySchema = UserRowSchema.pick({
  id: true,
  name: true,
  authorityLevel: true,
});

export const GetMyInfoReqBodySchema = z.object({});

