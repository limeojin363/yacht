import z from "zod";

export type UserAction = z.infer<typeof UserActionSchema>;

export const UsableDice = z.object({
  eye: z.number(),
  held: z.boolean(),
});

export const UsableDiceSetSchema = z.tuple([
  UsableDice,
  UsableDice,
  UsableDice,
  UsableDice,
  UsableDice,
]);

export const UnusableDiceSetSchema = z.tuple([
  z.null(),
  z.null(),
  z.null(),
  z.null(),
  z.null(),
]);

export const UserActionSchema = z.union([
  z.object({
    type: z.literal("HAND-SELECT"),
    payload: z.string(),
  }),
  z.object({
    type: z.literal("ROLL"),
    payload: UsableDiceSetSchema,
  }),
  z.object({
    type: z.literal("TOGGLE-HOLDING"),
    payload: z.number(),
  }),
]);

export const DiceEyesSchema = z.tuple([
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
]);

export type DiceEyes = z.infer<typeof DiceEyesSchema>;

export const HandInputMapSchema = z.record(
  z.string(),
  DiceEyesSchema.nullable()
);

export const DicesetSchema = z.union([
  UsableDiceSetSchema,
  UnusableDiceSetSchema,
]);

export const PlayerHandSelectionObjectSchema = z.record(
  z.string(),
  HandInputMapSchema
);

export const AlterOptionMetaInfoSchema = z.object({
  revealed: z.boolean(),
  turn: z.number(),
  name: z.string(),
});

export type AlterOptionMetaInfo = z.infer<typeof AlterOptionMetaInfoSchema>;

// export const PlayerInfoListSchema = z.record(
//   z.string(),
//   z.object({
//     color: z.string(),
//     handInputMap: HandInputMapSchema,
//   })
// );

export const PlayerInfoSchema = 
  z.object({
    name: z.string(),
    color: z.string(),
    handInputMap: HandInputMapSchema,
  });

export const GameStatusDataSchema = z.object({
  // 나중에고민: array -> object 왜 했지? 롤백?
  diceSet: DicesetSchema,
  remainingRoll: z.number(),
  playerInfoList: z.array(PlayerInfoSchema),
  currentPlayerIdx: z.number(),
  alterOptionMetaInfoList: z.array(AlterOptionMetaInfoSchema),
});

export type PlayerInfoType = z.infer<typeof PlayerInfoSchema>;

export type HandInputMapType = z.infer<typeof HandInputMapSchema>;

export type UsableDiceSet = z.infer<typeof UsableDiceSetSchema>;

export type UnusableDiceSet = z.infer<typeof UnusableDiceSetSchema>;

export type DiceSet = z.infer<typeof DicesetSchema>;

// GameStatus에서 DB에 저장되는 부분
export type GameDBPart = z.infer<typeof GameStatusDataSchema>;

export type RowInfo = {
  getScoreFrom: ({
    handInputMap,
  }: {
    handInputMap: HandInputMapType;
  }) => number;
  description: string;
  type: RowType;
};

export type RowType = "NORMAL" | "SINGLE_ALTERED" | "FUSION";
