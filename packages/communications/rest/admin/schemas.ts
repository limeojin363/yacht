import { z } from "zod";
import { TotalPlayersNumSchema } from "@yacht/default-game";

export const GenerateGameReqBodySchema = z.object({
  totalPlayers: TotalPlayersNumSchema,
});

export const GenerateGameResBodySchema = z.object({
  gameId: z.number(),
});

export const GetGamesReqBodySchema = z.object({ games: z.array(z.object({}))});

export const GetGamesResBodySchema = z.object({});

export const GetUsersReqBodySchema = z.object({ });

export const GetUsersResBodySchema = z.object({});
