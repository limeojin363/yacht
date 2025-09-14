import { z } from "zod";

export const LoginReqBodySchema = z.object({
  password: z.string(),
  username: z.string(),
});

export const LoginResBodySchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: z.object({
    id: z.number(),
    username: z.string(),
    authority_level: z.union([
      z.literal(0),
      z.literal(1),
      z.literal(2),
      z.literal(3),
    ]),
    g_connected: z.boolean(),
    g_id: z.number().nullable(),
  }),
});

export const RefreshReqBodySchema = z.object({
  refreshToken: z.string(),
});

export const RefreshResBodySchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const SignupReqBodySchema = z.object({});

export const SignupResBodySchema = z.object({});

export const LogoutReqBodySchema = z.object({});

export const LogoutResBodySchema = z.object({});
