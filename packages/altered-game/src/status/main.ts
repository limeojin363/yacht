import _ from "lodash";
import { GetDefaultScoreOf } from "../score";
import type {
  DiceEyes,
  GameStatusDataPart,
  UsableDiceSet,
  UserAction,
} from "./types";
import { AlterOptionMap } from "../alter-options";

export class GameStatus {
  alterOptions: GameStatusDataPart["alterOptions"];
  currentPlayerId: GameStatusDataPart["currentPlayerId"];
  diceSet: GameStatusDataPart["diceSet"];
  handSelectionObjects: GameStatusDataPart["playerHandSelectionObjectMap"];
  remainingRoll: GameStatusDataPart["remainingRoll"];

  maxHolding: number;
  maxRoll: number;
  rowCalculator: Record<string, (handInput: number[]) => number> = {
    ...GetDefaultScoreOf,
  };

  isUnusableDiceSet(): this is this & { diceSet: UsableDiceSet } {
    if (this.diceSet.some((d) => d === null)) return true;
    return false;
  }

  get rowNames() {
    return Object.keys(this.rowCalculator);
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

  getTotalScore({ playerId }: { playerId: number }) {
    const playerSelection = this.handSelectionObjects[playerId];
    if (playerSelection === undefined) throw new Error();

    let totalScore = 0;
    for (const [rowName, handInput] of Object.entries(playerSelection)) {
      const rowScoreGetter = this.rowCalculator[rowName];
      if (rowScoreGetter === undefined) throw new Error();

      if (handInput !== null) {
        totalScore += rowScoreGetter(handInput);
      }
    }
    return totalScore;
  }

  getScoreOf({ rowName, playerId }: { rowName: string; playerId: number }) {
    const playerSelection = this.handSelectionObjects[playerId];
    if (playerSelection === undefined) throw new Error();
    const handInput = playerSelection[rowName];
    if (handInput === undefined) throw new Error();
    const rowScoreGetter = this.rowCalculator[rowName];
    if (rowScoreGetter === undefined) throw new Error();

    if (handInput === null) return null;
    return rowScoreGetter(handInput);
  }

  dispatch({ type, payload }: UserAction) {
    // TODO: 객체 리팩토링을 통해 fall-through 회피
    switch (type) {
      // TODO: 턴 진행에 따라 alterOption reveal 수행되도록
      case "HAND-SELECT":
        const hand = payload;
        if (this.isUnusableDiceSet())
          throw new Error("Dice have not been rolled yet");

        const player = this.handSelectionObjects[this.currentPlayerId];

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
          if (!alterOption.revealed && alterOption.time * this.countTotalPlayers === this.currentTurn) {
            alterOption.revealed = true;
            this.triggerAlterOption(alterOption.name);
          }
        })

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
      currentPlayerId: this.currentPlayerId,
      diceSet: this.diceSet,
      playerHandSelectionObjectMap: this.handSelectionObjects,
      remainingRoll: this.remainingRoll,
    };
  }

  get currentTurn() {
    let turn = 0;
    Object.values(this.handSelectionObjects).forEach((handSelectionObject) => {
      Object.values(handSelectionObject).forEach((selection) => {
        if (selection !== null) {
          turn += 1;
        }
      });
    });
    return turn;
  }

  get countTotalHand() {
    const hands = Object.keys(this.handSelectionObjects[0]!);
    return hands.length;
  }

  get countTotalRow() {
    const rows = Object.keys(this.rowCalculator);
    return rows.length;
  }

  get countFilledCells() {
    let filledRowNum = 0;
    Object.values(this.handSelectionObjects).forEach((handSelectionObject) => {
      Object.values(handSelectionObject).forEach((selection) => {
        if (selection !== null) {
          filledRowNum += 1;
        }
      });
    });
    return filledRowNum;
  }

  getClone() {
    return _.cloneDeep(this);
  }

  getShallowClone() {
    return _.clone(this);
  }

  get isFinished() {
    for (const selection of Object.values(this.handSelectionObjects)) {
      if (Object.values(selection).some((v) => v === null)) {
        return false;
      }
    }
    return true;
  }

  get countTotalPlayers() {
    return Object.keys(this.handSelectionObjects).length;
  }

  get countTotalTurn() {
    return this.countTotalPlayers * this.countTotalRow;
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
    this.currentPlayerId = dataPart.currentPlayerId;
    this.diceSet = dataPart.diceSet;
    this.handSelectionObjects = dataPart.playerHandSelectionObjectMap;
    this.remainingRoll = dataPart.remainingRoll;

    this.maxHolding = 5;
    this.maxRoll = 3;
  }
}
