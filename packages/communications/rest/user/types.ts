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
} from "./schemas";

export type LoginReqBody = z.infer<typeof LoginReqBodySchema>;

export type LoginResBody = z.infer<typeof LoginResBodySchema>;

export type RefreshReqBody = z.infer<typeof RefreshReqBodySchema>;

export type RefreshResBody = z.infer<typeof RefreshResBodySchema>;

export type SignupReqBody = z.infer<typeof SignupReqBodySchema>;

export type SignupResBody = z.infer<typeof SignupResBodySchema>;

export type LogoutReqBody = z.infer<typeof LogoutReqBodySchema>;

export type LogoutResBody = z.infer<typeof LogoutResBodySchema>;
