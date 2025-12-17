import z from "zod";

export const GenerateGameReqBodySchema = z.object({});

export const GenerateGameResBodySchema = z.object({
  id: z.number(),
});
