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

export const SignupReqBodySchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const SignupResBodySchema = z.object({
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

export const LogoutReqBodySchema = z.object({});

export const LogoutResBodySchema = z.object({});

export const GetMyInfoResBodySchema = z.object({
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
});

export const GetMyInfoReqBodySchema = z.object({});

export const GetUserListReqBodySchema = z.object({});

export const GetUserListResBodySchema = z.object({
  users: z.array(
    z.object({
      id: z.number(),
      username: z.string(),
      authority_level: z.number(),
      g_connected: z.number().min(0).max(1),
      g_id: z.union([z.null(), z.number()]),
      g_name: z.union([z.null(), z.string()]),
    })
  ),
});

export const DeleteUserReqBodySchema = z.object({});

export const DeleteUserResBodySchema = z.object({});

export const UpdateUserReqBodySchema = z.object({});

export const UpdateUserResBodySchema = z.object({});
