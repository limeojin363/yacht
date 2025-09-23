import { z } from "zod";
import {
  EnterGameReqBodySchema,
  EnterGameResBodySchema,
  ExitGameReqBodySchema,
  ExitGameResBodySchema,
  GenerateGameReqBodySchema,
  GenerateGameResBodySchema,
  GetGameListReqBodySchema,
  // GetGameListResBodySchema,
  UpdateGameReqBodySchema,
  UpdateGameResBodySchema,
  DeleteGameReqBodySchema,
  DeleteGameResBodySchema,
} from "./schemas.js";

export type EnterGameReqBody = z.infer<typeof EnterGameReqBodySchema>;

export type EnterGameResBody = z.infer<typeof EnterGameResBodySchema>;

export type ExitGameReqBody = z.infer<typeof ExitGameReqBodySchema>;

export type ExitGameResBody = z.infer<typeof ExitGameResBodySchema>;

export type GenerateGameReqBody = z.infer<typeof GenerateGameReqBodySchema>;

export type GenerateGameResBody = z.infer<typeof GenerateGameResBodySchema>;

export type GetGameListReqBody = z.infer<typeof GetGameListReqBodySchema>;

export type GetGameListResBody = {
  games: {
    totalPlayers: 2 | 3 | 4;
    currentPlayers: 0 | 1 | 2 | 3 | 4;
    id: number;
    name: string;
    infoForAdmin?: {
      u_id_list: string[];
      u_name_list: string[];
    };
  }[];
};

export type UpdateGameReqBody = z.infer<typeof UpdateGameReqBodySchema>;

export type UpdateGameResBody = z.infer<typeof UpdateGameResBodySchema>;

export type DeleteGameReqBody = z.infer<typeof DeleteGameReqBodySchema>;

export type DeleteGameResBody = z.infer<typeof DeleteGameResBodySchema>;
