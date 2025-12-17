import { z } from "zod";

export const DeleteGameReqBodySchema = z.object({
  id: z.number(),
});

export const DeleteGameResBodySchema = z.object({});
