import z from "zod";
import type { AuthorityLevelSchema, UserRowSchema } from "./schema.js";

export type AuthorityLevel = z.infer<typeof AuthorityLevelSchema>;

export type UserRowType = z.infer<typeof UserRowSchema>;
