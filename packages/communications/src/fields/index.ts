import type { PlayerId } from "@yacht/default-game";
import z from "zod";

export const ProgressTypeSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
]);

export type ProgressType = z.infer<typeof ProgressTypeSchema>;

export const AuthorityLevelSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
]);

export type AuthorityLevel = z.infer<typeof AuthorityLevelSchema>;

export type PlayerList = (null | {
  username: string;
  userId: number;
  playerColor: string | null;
  connected: number;
})[];

export type Player = {
  username: string;
  userId: number;
  connected: number;
  playerId: PlayerId;
  playerColor: string;
};

