import { defaultEndpointsFactory } from "express-zod-api";
import { userCheckMiddleWare } from "../../auths/middleware.js";
import {
  GenerateGameReqBodySchema,
  GenerateGameResBodySchema,
  type ProgressType,
} from "@yacht/communications";
// import { getInitialGameStatus } from "@yacht/default-game";
import { PrismaClient } from "../../generated/client.js";
import { ColorFactory, getInitialDBPart } from "@yacht/game-core";

const getInitialPreset = () => {
  const colorFactory = new ColorFactory();

  return ({
    alterOptionMetaList: [
      { name: "NUMBERS_3_3x", revealed: false, turn: 1 },
      {
        name: "FUSION_1&2",
        revealed: false,
        turn: 1,
      },
    ],
    playerPresetList: [
      { name: "PLAYER 1", color: colorFactory.generate().getBaseColor() },
      { name: "PLAYER 2", color: colorFactory.generate().getBaseColor() },
    ],
  })}


export const generateGameEndpoint = defaultEndpointsFactory
  .addMiddleware(userCheckMiddleWare)
  .build({
    input: GenerateGameReqBodySchema,
    output: GenerateGameResBodySchema,
    method: "post",
    handler: async ({ input: { name } }) => {
      const prismaClient = new PrismaClient();
      const gameDBPart = getInitialDBPart(getInitialPreset());
      const gameStatusJSON = JSON.stringify(gameDBPart);
      const progressType: ProgressType = 0;

      const { id } = await prismaClient.game.create({
        data: {
          gameCoreInfo: gameStatusJSON,
          progressType,
          name,
          playerUpperLimit: 2,
        },
      });

      return {
        progressType,
        id,
        name,
      };
    },
  });
