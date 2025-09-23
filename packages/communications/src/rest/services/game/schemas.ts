import { z } from "zod";
import { TotalPlayersNumSchema } from "@yacht/default-game";

export const EnterGameReqBodySchema = z.object({});

export const EnterGameResBodySchema = z.object({});

export const ExitGameReqBodySchema = z.object({});

export const ExitGameResBodySchema = z.object({});

export const GenerateGameReqBodySchema = z.object({
  totalPlayers: TotalPlayersNumSchema,
});

export const GenerateGameResBodySchema = z.object({
  gameId: z.number(),
});

export const GetGameListReqBodySchema = z.object({
  games: z.array(z.object({})),
});

export const GetGameListResBodySchema = z.object({});

export const UpdateGameReqBodySchema = z.object({});

export const UpdateGameResBodySchema = z.object({});

export const DeleteGameReqBodySchema = z.object({});

export const DeleteGameResBodySchema = z.object({});
