export type HandInput = [number, number, number, number, number] | null;

export type DiceNum = 1 | 2 | 3 | 4 | 5 | 6;

export type GetFieldConfigBase = (...baseProps: any[]) => Record<
  string,
  (...calculationProps: any[]) => {
    getScore: (...handInputs: HandInput[]) => number;
    description: string;
    view: { name: string };
  }
>;
