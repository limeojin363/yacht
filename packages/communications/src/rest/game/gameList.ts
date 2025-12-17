import { z } from "zod";

export const GetGameListReqBodySchema = z.object({});

export const GamePlayersMeta = z.object({
  total: z.number(),
  current: z.number(),
});

export const GameMetaItem = z.object({
    id: z.number(),
    name: z.string(),
    playersMeta: GamePlayersMeta,
  })

export const GetGameListResBodySchema = z.object({
  list: GameMetaItem.array(),
});
