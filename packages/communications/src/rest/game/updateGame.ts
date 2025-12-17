import { z } from "zod";

export const UpdateGameReqBodySchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(30),
});

export const UpdateGameResBodySchema = z.object({
  id: z.number(),
  name: z.string(),
});
