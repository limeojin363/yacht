import z from "zod";

export const AuthorityLevelSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
]);

export const UserRowSchema = z.object({
  id: z.number(),
  name: z.string(),
  password: z.string(),
  authorityLevel: AuthorityLevelSchema,
  salt: z.string(),
  gameId: z.number().nullable(),
  gameConnected: z.number().nullable(),
  gamePlayerId: z.number().nullable(),
});
