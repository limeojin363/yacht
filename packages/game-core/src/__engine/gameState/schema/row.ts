import z from "zod";

export const RowNameSchema = z.enum([
  "NUMBERS_N",
  "N_OF_A_KIND",
  "STRAIGHT",
  "CHOICE",
  "YACHT",
  "FULL_HOUSE",
  "FUSION", // To be implemented
]);

export const TotalScoreSchema = z.object({
  type: z.string(),
  props: z.number().array().nullable(),
});

export const HandSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const CalculatorSchema = z.enum([
  "default",
  "multiply",
  "pow",
  "if_zero_become_n",
  "if_satisfying_become_n",
]);

export const ScoreRowSchema = z.object({
  id: z.string(),
  name: RowNameSchema,
  hands: HandSchema.array(),
  calculatorName: CalculatorSchema,
  params: z.number().array().nullable(),
});

export type FieldBaseName = z.infer<typeof RowNameSchema>;

export type Hand = z.infer<typeof HandSchema>;

export type ScoreRow = z.infer<typeof ScoreRowSchema>;

export type TotalScore = z.infer<typeof TotalScoreSchema>;

export type FieldScoreCalculatorName = z.infer<typeof CalculatorSchema>;
