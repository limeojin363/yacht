import { z } from "zod";
import { GameStatusSchema, PlayersNumSchema } from "@yacht/default-game";
import { ProgressTypeSchema } from "../../../fields";

export const EnterGameReqBodySchema = z.object({});

export const EnterGameResBodySchema = z.object({});

export const ExitGameReqBodySchema = z.object({});

export const ExitGameResBodySchema = z.object({});

export const GenerateGameReqBodySchema = z.object({
  totalPlayersNum: PlayersNumSchema,
  name: z.string().min(1).max(30),
});

export const GenerateGameResBodySchema = z.object({
  id: z.number(),
  gameStatus: GameStatusSchema,
  progressType: ProgressTypeSchema,
  name: z.string(),
});

export const UpdateGameReqBodySchema = z.object({
  id: z.number(),
  totalPlayersNum: PlayersNumSchema,
  name: z.string().min(1).max(30),
});

export const UpdateGameResBodySchema = z.object({
  id: z.number(),
  gameStatus: GameStatusSchema,
  progressType: ProgressTypeSchema,
  name: z.string(),
});

export const DeleteGameReqBodySchema = z.object({
  id: z.number(),
});

export const DeleteGameResBodySchema = z.object({});

export const GetGameListReqBodySchema = z.object({});

export const GetGameListResBodySchema = z.object({
  games: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      players: z.array(z.object({ id: z.number(), name: z.string() })),
    }),
  ),
});
