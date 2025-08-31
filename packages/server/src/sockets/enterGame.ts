import { z } from "zod";

const UserSchema = z.object({
  id: z.enum(["1", "2"]),
});

type User = z.infer<typeof UserSchema>;

const enterGame = () => {};
