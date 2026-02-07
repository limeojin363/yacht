import z from "zod";

// 아직 어떤 옵션인지 모름: { id: null, revealed: false, resolved: false }
// 서버에서 추첨만 완료: { id: "NUMBERS_EXODIA", revealed: false, resolved: false }
// 공개: { id: "NUMBERS_EXODIA", revealed: true, resolved: false }
// 효과 적용 완료: { id: "NUMBERS_EXODIA", revealed: true, resolved: true }

export const ChangerMetaSchema = z
  .object({
    turn: z.number(),
    id: z.string().nullable(), // null === not decided yet
    revealed: z.boolean(),
    resolved: z.boolean(),
  })
  .superRefine((val, ctx) => {
    const decided = val.id !== null;

    // Rule 1:
    // undecided → revealed === false && resolved === false
    if (!decided) {
      if (val.revealed) {
        ctx.addIssue({
          code: "custom",
          message: "Undecided changer cannot be revealed",
        });
      }
      if (val.resolved) {
        ctx.addIssue({
          code: "custom",
          message: "Undecided changer cannot be resolved",
        });
      }
    }

    // Rule 2:
    // not revealed → resolved === false
    if (!val.revealed && val.resolved) {
      ctx.addIssue({
        code: "custom",
        message: "Unrevealed changer cannot be resolved",
      });
    }
  });
