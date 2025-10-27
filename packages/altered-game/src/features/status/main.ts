import _ from "lodash";
import AlterOptionMap from "../alter-options/maps";
import { GetDefaultScoreOf } from "../score";
import type { GameStatusDataPart, UserAction } from "./types";
import { getDiceEyes, isUnusableDiceSet } from "../../utils";

export class GameStatus {
  private alterOptions: GameStatusDataPart["alterOptions"];
  private currentPlayerId: GameStatusDataPart["currentPlayerId"];
  private diceSet: GameStatusDataPart["diceSet"];
  public handSelectionObjects: GameStatusDataPart["playerHandSelectionObjectMap"];
  private remainingRoll: GameStatusDataPart["remainingRoll"];

  public maxHolding: number;
  public maxRoll: number;
  public rowCalculator: Record<string, (handInput: number[]) => number> = {
    ...GetDefaultScoreOf,
  };

  public getTotalScore({ playerId }: { playerId: number }) {
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
  }

  public getScoreOf({
    rowName,
    playerId,
  }: {
    rowName: string;
    playerId: number;
  }) {
    const playerSelection = this.handSelectionObjects[playerId];
    if (playerSelection === undefined) throw new Error();
    const handInput = playerSelection[rowName];
    if (handInput === undefined) throw new Error();
    const rowScoreGetter = this.rowCalculator[rowName];
    if (rowScoreGetter === undefined) throw new Error();

    if (handInput === null) return null;
    return rowScoreGetter(handInput);
  }

  public dispatch({ type, payload }: UserAction) {
    switch (type) {
      case "HAND-SELECT":
        const hand = payload;
        if (isUnusableDiceSet(this.diceSet))
          throw new Error("Dice have not been rolled yet");

        const player = this.handSelectionObjects[this.currentPlayerId];

        if (player === undefined) {
          throw new Error("Player does not exist");
        }

        if (player[hand] === undefined) {
          throw new Error("Hand does not exist");
        }

        if (player[hand] !== null) {
          throw new Error("Hand already selected");
        }

        player[hand] = getDiceEyes(this.diceSet);
        break;
      case "ROLL":
        const diceSet = payload;
        if (this.remainingRoll <= 0) throw new Error("No remaining rolls left");
        this.diceSet = diceSet;
        this.remainingRoll -= 1;
        break;
      case "TOGGLE-HOLDING":
        if (isUnusableDiceSet(this.diceSet))
          throw new Error("Dice have not been rolled yet");
        const diceIndex = payload;

        const dice = this.diceSet[diceIndex];
        if (dice === undefined) throw new Error();

        if (!dice.held && this.currentHeldDices >= this.maxHolding) {
          throw new Error("Holding limit exceeded");
        }

        break;
    }
  }

  public triggerAlterOption(alterOptionName: string) {
    const alterOption = AlterOptionMap[alterOptionName];
    if (alterOption === undefined) throw new Error("No alterOption");

    alterOption.onTrigger(this);
  }

  /** Extracts the relevant data part from the game status */
  public extractDataPart(): GameStatusDataPart {
    return {
      alterOptions: this.alterOptions,
      currentPlayerId: this.currentPlayerId,
      diceSet: this.diceSet,
      playerHandSelectionObjectMap: this.handSelectionObjects,
      remainingRoll: this.remainingRoll,
    };
  }

  public get currentTurn() {
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

  public get totalHand() {
    const hands = Object.keys(this.handSelectionObjects[0]!);
    return hands.length;
  }

  public get totalRow() {
    const rows = Object.keys(this.rowCalculator);
    return rows.length;
  }

  public get currentFilledRowNum() {
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

  public getClone() {
    return _.cloneDeep(this);
  }

  public get isFinished() {
    for (const selection of Object.values(this.handSelectionObjects)) {
      if (Object.values(selection).some((v) => v === null)) {
        return false;
      }
    }
    return true;
  }

  public get totalPlayers() {
    return Object.keys(this.handSelectionObjects).length;
  }

  public get totalTurn() {
    return this.totalPlayers * this.totalRow;
  }

  public get currentHeldDices() {
    if (isUnusableDiceSet(this.diceSet)) return 0;
    return this.diceSet.filter((d) => d !== null && d.held).length;
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
