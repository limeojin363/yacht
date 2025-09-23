import type {
  UpdateGameReqBody,
  UpdateGameResBody,
} from "@yacht/communications";
import type { RequestHandler } from "express";

export const updateGame: RequestHandler<
  unknown,
  UpdateGameResBody | { message: string },
  UpdateGameReqBody
> = async (req, res) => {};
