import { z } from "zod";
import {
  EnterTheRoomReqBodySchema,
  EnterTheRoomResBodySchema,
  ExitTheRoomReqBodySchema,
  ExitTheRoomResBodySchema,
} from "./schemas";

export type EnterTheRoomReqBody = z.infer<typeof EnterTheRoomReqBodySchema>;

export type EnterTheRoomResBody = z.infer<typeof EnterTheRoomResBodySchema>;

export type ExitTheRoomReqBody = z.infer<typeof ExitTheRoomReqBodySchema>;

export type ExitTheRoomResBody = z.infer<typeof ExitTheRoomResBodySchema>;
