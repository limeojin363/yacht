export type HandUnit = {
  id: number;
  status: "EMPTY" | "FILLABLE" | "FILLED";
  content: string | null;
};

