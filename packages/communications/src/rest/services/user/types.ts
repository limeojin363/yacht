import { z } from "zod";
import {
  LoginReqBodySchema,
  LoginResBodySchema,
  RefreshReqBodySchema,
  RefreshResBodySchema,
  SignupReqBodySchema,
  SignupResBodySchema,
  LogoutReqBodySchema,
  LogoutResBodySchema,
  GetMyInfoReqBodySchema,
  GetMyInfoResBodySchema,
  GetUserListReqBodySchema,
  GetUserListResBodySchema,
  DeleteUserReqBodySchema,
  DeleteUserResBodySchema,
  UpdateUserReqBodySchema,
  UpdateUserResBodySchema,
} from "./schemas.js";

export type LoginReqBody = z.infer<typeof LoginReqBodySchema>;

export type LoginResBody = z.infer<typeof LoginResBodySchema>;

export type RefreshReqBody = z.infer<typeof RefreshReqBodySchema>;

export type RefreshResBody = z.infer<typeof RefreshResBodySchema>;

export type SignupReqBody = z.infer<typeof SignupReqBodySchema>;

export type SignupResBody = z.infer<typeof SignupResBodySchema>;

export type LogoutReqBody = z.infer<typeof LogoutReqBodySchema>;

export type LogoutResBody = z.infer<typeof LogoutResBodySchema>;

export type GetMyInfoReqBody = z.infer<typeof GetMyInfoReqBodySchema>;

export type GetMyInfoResBody = z.infer<typeof GetMyInfoResBodySchema>;

export type GetUserListReqBody = z.infer<typeof GetUserListReqBodySchema>;

export type GetUserListResBody = z.infer<typeof GetUserListResBodySchema>;

export type DeleteUserReqBody = z.infer<typeof DeleteUserReqBodySchema>;

export type DeleteUserResBody = z.infer<typeof DeleteUserResBodySchema>;

export type UpdateUserReqBody = z.infer<typeof UpdateUserReqBodySchema>;

export type UpdateUserResBody = z.infer<typeof UpdateUserResBodySchema>;
