type Filled = [number, number, number, number, number];

export const isFilled = (
  handInput: Filled | null | undefined,
  { errorMsg }: { errorMsg: string },
): handInput is Filled => {
  if (handInput === undefined) throw new Error(errorMsg);
  if (handInput === null) return false;
  return true;
};
