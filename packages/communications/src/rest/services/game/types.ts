import { z } from "zod";
import type {
  EnterGameReqBodySchema,
  EnterGameResBodySchema,
  ExitGameReqBodySchema,
  ExitGameResBodySchema,
  GenerateGameReqBodySchema,
  GenerateGameResBodySchema,
  GetGameListReqBodySchema,
  UpdateGameReqBodySchema,
  UpdateGameResBodySchema,
  DeleteGameReqBodySchema,
  DeleteGameResBodySchema,
  GetGameListResBodySchema,
} from "./schemas.js";

export type EnterGameReqBody = z.infer<typeof EnterGameReqBodySchema>;

export type EnterGameResBody = z.infer<typeof EnterGameResBodySchema>;

export type ExitGameReqBody = z.infer<typeof ExitGameReqBodySchema>;

export type ExitGameResBody = z.infer<typeof ExitGameResBodySchema>;

export type GenerateGameReqBody = z.infer<typeof GenerateGameReqBodySchema>;

export type GenerateGameResBody = z.infer<typeof GenerateGameResBodySchema>;

export type UpdateGameReqBody = z.infer<typeof UpdateGameReqBodySchema>;

export type UpdateGameResBody = z.infer<typeof UpdateGameResBodySchema>;

export type DeleteGameReqBody = z.infer<typeof DeleteGameReqBodySchema>;

export type DeleteGameResBody = z.infer<typeof DeleteGameResBodySchema>;

export type GetGameListReqBody = z.infer<typeof GetGameListReqBodySchema>;

export type GetGameListResBody = z.infer<typeof GetGameListResBodySchema>;
