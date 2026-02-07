type ActiveDice = {
  held: boolean;
  value: number;
};

type DiceSet =
  | [ActiveDice, ActiveDice, ActiveDice, ActiveDice, ActiveDice]
  | [null, null, null, null, null];

type Player = {
  name: string;
  color: string;
  /** id에 해당되는 hand의 input을 가져옴 */
  handInputMap: Record<string, [number, number, number, number, number] | null>;
};

type ScoreFieldInfo = {
  base: { type: string; props: number[] };
  calculation: { type: string; props: number[] };
  handIdList: string[];
};

type Changer = {
  turn: number;
  id: string;
  revealed: boolean;
  resolved: boolean;
};

export type GameState = {
  diceSet: DiceSet;
  remainingRoll: number;

  holdingLowerLimit: number;
  holdingUpperLimit: number;
  maxRoll: number;

  currentTurn: number;
  currentPlayerIdx: number;

  playerList: Player[];

  changerList: Changer[];

  fieldIdList: string[];
  fieldInfoMap: Record<string, ScoreFieldInfo>;
  totalScoreCalculationInfo: { type: string; props: number[] };

  endingCondition: { type: string; props: number[] };
};
