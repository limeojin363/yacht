import z from "zod";

export const DiceEyesSchema = z.tuple([
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
]);

export const UsableDiceSchema = z.object({
  eye: z.number(),
  held: z.boolean(),
});

export const UsableDiceSetSchema = z.tuple([
  UsableDiceSchema,
  UsableDiceSchema,
  UsableDiceSchema,
  UsableDiceSchema,
  UsableDiceSchema,
]);

export const UnusableDiceSetSchema = z.tuple([
  z.null(),
  z.null(),
  z.null(),
  z.null(),
  z.null(),
]);

export const DiceSetSchema = z.union([
  UsableDiceSetSchema,
  UnusableDiceSetSchema,
]);
