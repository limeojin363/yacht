import { z } from "zod";
import {
  GenerateGameReqBodySchema,
  GenerateGameResBodySchema,
  GetGamesReqBodySchema,
  GetGamesResBodySchema,
  GetUsersReqBodySchema,
  GetUsersResBodySchema,
} from "./schemas";

export type GenerateGameReqBody = z.infer<typeof GenerateGameReqBodySchema>;

export type GenerateGameResBody = z.infer<typeof GenerateGameResBodySchema>;

export type GetGamesReqBody = z.infer<typeof GetGamesReqBodySchema>;

export type GetGamesResBody = z.infer<typeof GetGamesResBodySchema>;

export type GetUsersReqBody = z.infer<typeof GetUsersReqBodySchema>;

export type GetUsersResBody = z.infer<typeof GetUsersResBodySchema>;
