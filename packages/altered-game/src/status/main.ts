import _ from "lodash";
import { getInitialRowInfo } from "../score";
import type {
  DiceEyes,
  GameStatusDataPart,
  RowInfo,
  UnusableDiceSet,
  UsableDiceSet,
  UserAction,
} from "./types";
import { AlterOptionMap } from "../alter-options";

export class GameStatus {
  alterOptions: GameStatusDataPart["alterOptions"];
  currentPlayerName: GameStatusDataPart["currentPlayerName"];
  diceSet: GameStatusDataPart["diceSet"];
  playerHandSelectionObjectMap: GameStatusDataPart["playerHandSelectionObjectMap"];
  playerColorMap: GameStatusDataPart["playerColorMap"];
  remainingRoll: GameStatusDataPart["remainingRoll"];

  maxHolding: number;
  maxRoll: number;
  rowInfoMap: Record<string, RowInfo>;

  isUnusableDiceSet(): this is this & { diceSet: UnusableDiceSet } {
    if (this.diceSet.some((d) => d === null)) return true;
    return false;
  }

  getRowTypeOf(rowName: string) {
    const rowInfo = this.rowInfoMap[rowName];
    if (rowInfo === undefined) throw new Error("No such row");

    return rowInfo.type;
  }

  get rowNames() {
    const rowNames = Object.keys(this.rowInfoMap);

    const upperRows = rowNames
      .filter(
        (name) => name.startsWith("NUMBERS_") || name.startsWith("FUSION_")
      )
      .sort((a, b) => {
        return parseInt(a.split("_")[1]![0]!) - parseInt(b.split("_")[1]![0]!);
      });
    const lowerRows = rowNames.filter(
      (name) => !name.startsWith("NUMBERS_") && !name.startsWith("FUSION_")
    );

    return [...upperRows, ...lowerRows];
  }

  get playerNames() {
    return Object.keys(this.playerHandSelectionObjectMap);
  }

  get diceEyes(): DiceEyes {
    if (this.isUnusableDiceSet()) {
      throw new Error("Dice have not been rolled yet");
    }
    return this.diceSet.map((d) => d!.eye) as DiceEyes;
  }

  static generateDiceEye() {
    const eyes = [1, 2, 3, 4, 5, 6] as const;
    return eyes[Math.floor(Math.random() * eyes.length)]!;
  }

  getPlayerTotalScore({ playerName }: { playerName: string }) {
    const playerSelection = this.playerHandSelectionObjectMap[playerName];
    if (playerSelection === undefined) throw new Error();

    let totalScore = 0;
    for (const [rowName, handInput] of Object.entries(playerSelection)) {
      const currRowInfo = this.rowInfoMap[rowName];
      if (currRowInfo === undefined) throw new Error();

      if (handInput !== null) {
        totalScore += currRowInfo.getScore(handInput);
      }
    }
    return totalScore;
  }

  getScoreOf({ rowName, playerName }: { rowName: string; playerName: string }) {
    const playerSelection = this.playerHandSelectionObjectMap[playerName];
    if (playerSelection === undefined) throw new Error();
    const handInput = playerSelection[rowName];
    if (handInput === undefined) throw new Error();
    const currRowInfo = this.rowInfoMap[rowName];
    if (currRowInfo === undefined) throw new Error();

    if (handInput === null) return null;
    return currRowInfo.getScore(handInput);
  }

  dispatch({ type, payload }: UserAction) {
    // TODO: 객체 리팩토링을 통해 fall-through 회피
    switch (type) {
      // TODO: 턴 진행에 따라 alterOption reveal 수행되도록
      case "HAND-SELECT":
        const hand = payload;
        if (this.isUnusableDiceSet())
          throw new Error("Dice have not been rolled yet");

        const player =
          this.playerHandSelectionObjectMap[this.currentPlayerName];

        if (player === undefined) {
          throw new Error("Player does not exist");
        }

        if (player[hand] === undefined) {
          throw new Error("Hand does not exist");
        }

        if (player[hand] !== null) {
          throw new Error("Hand is already selected");
        }

        player[hand] = this.diceEyes;

        this.alterOptions.forEach((alterOption) => {
          if (!alterOption.revealed && alterOption.time === this.currentTurn) {
            alterOption.revealed = true;
            this.triggerAlterOption(alterOption.name);
          }
        });

        const nextPlayerIdx =
          (this.playerNames.indexOf(this.currentPlayerName) + 1) %
          this.countTotalPlayers;
        const nextPlayerName = this.playerNames[nextPlayerIdx]!;
        this.currentPlayerName = nextPlayerName;
        this.remainingRoll = this.maxRoll;
        this.diceSet = [null, null, null, null, null];

        return this.getShallowClone();
      case "ROLL":
        if (this.remainingRoll <= 0) throw new Error("No remaining rolls left");
        this.diceSet = payload;
        this.remainingRoll -= 1;

        return this.getShallowClone();
      case "TOGGLE-HOLDING":
        if (this.isUnusableDiceSet())
          throw new Error("Dice have not been rolled yet");
        const diceIndex = payload;

        const dice = this.diceSet[diceIndex];
        if (!dice) throw new Error("Dice does not exist");

        if (!dice.held && this.countHeldDices >= this.maxHolding) {
          throw new Error("Holding limit exceeded");
        }

        dice.held = !dice.held;

        return this.getShallowClone();
    }
  }

  triggerAlterOption(alterOptionName: string) {
    const alterOption = AlterOptionMap[alterOptionName];
    if (alterOption === undefined) throw new Error("No alterOption");

    alterOption.onTrigger(this);
  }

  /** Extracts the relevant data part from the game status */
  extractDataPart(): GameStatusDataPart {
    return {
      alterOptions: this.alterOptions,
      currentPlayerName: this.currentPlayerName,
      diceSet: this.diceSet,
      playerHandSelectionObjectMap: this.playerHandSelectionObjectMap,
      remainingRoll: this.remainingRoll,
      playerColorMap: this.playerColorMap,
    };
  }

  // 각 유저가 한 칸씩 채우면 다음 턴이 된다
  get currentTurn() {
    let filled = 0;
    Object.values(this.playerHandSelectionObjectMap).forEach(
      (handSelectionObject) => {
        Object.values(handSelectionObject).forEach((selection) => {
          if (selection !== null) {
            filled += 1;
          }
        });
      }
    );
    return Math.floor(filled / this.countTotalPlayers + 1);
  }

  get countTotalHand() {
    const hands = Object.keys(
      this.playerHandSelectionObjectMap[this.playerNames[0]!]!
    );
    return hands.length;
  }

  get countTotalRow() {
    const rows = Object.keys(this.rowInfoMap);
    return rows.length;
  }

  get countFilledCells() {
    let filledRowNum = 0;
    Object.values(this.playerHandSelectionObjectMap).forEach(
      (handSelectionObject) => {
        Object.values(handSelectionObject).forEach((selection) => {
          if (selection !== null) {
            filledRowNum += 1;
          }
        });
      }
    );
    return filledRowNum;
  }

  getClone() {
    return _.cloneDeep(this);
  }

  getShallowClone() {
    return _.clone(this);
  }

  get isFinished() {
    for (const selection of Object.values(this.playerHandSelectionObjectMap))
      if (Object.values(selection).some((v) => v === null)) return false;

    return true;
  }

  get countTotalPlayers() {
    return Object.keys(this.playerHandSelectionObjectMap).length;
  }

  get countTotalTurn() {
    return this.countTotalHand;
  }

  get countHeldDices() {
    if (this.isUnusableDiceSet()) return 0;
    return this.diceSet.filter((d) => d !== null && d.held).length;
  }

  generateNextDiceSet(): UsableDiceSet {
    if (!this.isUnusableDiceSet()) {
      return this.diceSet.map((dice) =>
        dice!.held ? dice : { eye: GameStatus.generateDiceEye(), held: false }
      ) as UsableDiceSet;
    }

    return [
      { eye: GameStatus.generateDiceEye(), held: false },
      { eye: GameStatus.generateDiceEye(), held: false },
      { eye: GameStatus.generateDiceEye(), held: false },
      { eye: GameStatus.generateDiceEye(), held: false },
      { eye: GameStatus.generateDiceEye(), held: false },
    ];
  }

  constructor(dataPart: GameStatusDataPart) {
    this.alterOptions = dataPart.alterOptions;
    this.currentPlayerName = dataPart.currentPlayerName;
    this.diceSet = dataPart.diceSet;
    this.playerHandSelectionObjectMap = dataPart.playerHandSelectionObjectMap;
    this.remainingRoll = dataPart.remainingRoll;
    this.playerColorMap = dataPart.playerColorMap;

    this.maxHolding = 5;
    this.maxRoll = 3;
    this.rowInfoMap = getInitialRowInfo();
  }
}
