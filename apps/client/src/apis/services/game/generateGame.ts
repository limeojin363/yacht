import type { ResponsePromise } from "ky";
import authenticatedApiClient from "../../core/clients";
import {
  type GenerateGameReqBody,
  type GenerateGameResBody,
} from "@yacht/communications";

type GenerateGameType = (
  b: GenerateGameReqBody
) => ResponsePromise<GenerateGameResBody>;

export const GenerateGame: GenerateGameType = (body) =>
  authenticatedApiClient.post("game/generate", { json: body });
