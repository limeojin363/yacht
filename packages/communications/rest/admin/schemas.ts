import { z } from "zod";
import { TotalPlayersNumSchema } from "@yacht/games/default";

export const GenerateGameReqBodySchema = z.object({
  totalPlayers: TotalPlayersNumSchema,
});

export const GenerateGameResBodySchema = z.object({
  gameId: z.number(),
});

export const GetGamesReqBodySchema = z.object({});

export const GetGamesResBodySchema = z.object({});

export const GetUsersReqBodySchema = z.object({});

export const GetUsersResBodySchema = z.object({});
