import _ from "lodash";
import { getInitialRowInfo } from "../score";
import type { DiceEyes, GameDBPart, RowInfo, UsableDiceSet } from "./types";
import { AlterOptionMap } from "../alter-options";

// 유저가 넣는 칸이 hand고, 계산 시 나오는 결과가 row다.
// 대체로 hand == row이지만 예외가 있다.
// Ex) Fusion Row의 경우 hand 두 개로 구성
export class Game {
  diceSet: GameDBPart["diceSet"];
  alterOptionMetaInfoList: GameDBPart["alterOptionMetaInfoList"];
  currentPlayerName: GameDBPart["currentPlayerName"];
  remainingRoll: GameDBPart["remainingRoll"];
  playerMap: GameDBPart["playerInfoMap"];

  maxHolding: number;
  maxRoll: number;
  rowInfoMap: Record<string, RowInfo>;

  isDiceSetUsable(): this is this & { diceSet: UsableDiceSet } {
    return this.diceSet.every((d) => d !== null);
  }

  /** Extract eye only from diceSet */
  extractDiceEyes(): DiceEyes {
    if (!this.isDiceSetUsable()) {
      throw new Error("Dice have not been rolled yet");
    }

    return this.diceSet.map((d) => d!.eye) as DiceEyes;
  }

  toggleDice(diceIndex: number) {
    if (!this.isDiceSetUsable()) {
      throw new Error("Dice have not been rolled yet");
    }

    const dice = this.diceSet[diceIndex];
    if (!dice) throw new Error("Dice does not exist");

    if (!dice.held && this.countHeldDices() >= this.maxHolding) {
      throw new Error("Holding limit exceeded");
    }

    dice.held = !dice.held;
  }

  generateNextDiceSet(): UsableDiceSet {
    if (this.isDiceSetUsable()) {
      return this.diceSet.map((dice) =>
        dice!.held ? dice : { eye: Game.generateDiceEye(), held: false }
      ) as UsableDiceSet;
    }

    return [
      { eye: Game.generateDiceEye(), held: false },
      { eye: Game.generateDiceEye(), held: false },
      { eye: Game.generateDiceEye(), held: false },
      { eye: Game.generateDiceEye(), held: false },
      { eye: Game.generateDiceEye(), held: false },
    ];
  }

  hasMoreRoll() {
    return this.remainingRoll > 0;
  }

  countHeldDices() {
    if (!this.isDiceSetUsable()) return 0;
    return this.diceSet.filter((d) => d !== null && d.held).length;
  }

  resetDiceSet() {
    this.diceSet = [null, null, null, null, null];
  }

  getRowNameList() {
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

  getPlayerInfoOf(playerName: string) {
    const playerInfo = this.playerMap[playerName];
    if (playerInfo === undefined) throw new Error("No such player");
    return playerInfo;
  }

  getColorOf(playerName: string) {
    return this.getPlayerInfoOf(playerName).color;
  }

  getPlayerNameList() {
    return Object.keys(this.playerMap);
  }

  getHandInputMapOf(playerName: string) {
    return this.getPlayerInfoOf(playerName).handInputMap;
  }

  getHandOf({
    handName,
    playerName,
  }: {
    playerName: string;
    handName: string;
  }) {
    const handInputMap = this.getHandInputMapOf(playerName);
    const handInput = handInputMap[handName];
    if (handInput === undefined) throw new Error("No such hand");
    return handInput;
  }

  getRowInfoOf(rowName: string) {
    const targetRowInfo = this.rowInfoMap[rowName];
    if (targetRowInfo === undefined) throw new Error("No such row");
    return targetRowInfo;
  }

  removeHand({ handName }: { handName: string }) {
    Object.values(this.playerMap).forEach((playerInfo) => {
      delete playerInfo.handInputMap[handName];
    });
  }

  addHand({ handName }: { handName: string }) {
    Object.values(this.playerMap).forEach((playerInfo) => {
      playerInfo.handInputMap[handName] = null;
    });
  }

  checkAlterOptions() {
    this.alterOptionMetaInfoList.forEach((alterOption) => {
      if (!alterOption.revealed && alterOption.time === this.getCurrentTurn()) {
        alterOption.revealed = true;
        this.triggerAlterOption(alterOption.name);
      }
    });
  }

  enterUserHandInput({ handName, eyes }: { handName: string; eyes: DiceEyes }) {
    const playerInfo = this.playerMap[this.currentPlayerName];
    if (playerInfo === undefined) throw new Error("No such player");

    if (playerInfo.handInputMap[handName] === undefined)
      throw new Error("No such hand");

    if (playerInfo.handInputMap[handName] !== null)
      throw new Error("Hand is already filled");

    playerInfo.handInputMap[handName] = eyes;

    this.checkAlterOptions();

    const nextPlayerIdx =
      (this.getPlayerNames().indexOf(this.currentPlayerName) + 1) %
      this.countTotalPlayers();
    const nextPlayerName = this.getPlayerNames()[nextPlayerIdx]!;
    this.currentPlayerName = nextPlayerName;
    this.remainingRoll = this.maxRoll;
    this.diceSet = [null, null, null, null, null];
  }

  getScoreOf({ rowName, playerName }: { rowName: string; playerName: string }) {
    const handInputMap = this.getHandInputMapOf(playerName);
    const targetRowInfo = this.getRowInfoOf(rowName);

    return targetRowInfo.getScoreFrom({
      handInputMap,
    });
  }

  getRowTypeOf(rowName: string) {
    return this.getRowInfoOf(rowName).type;
  }

  removeRowInfo({ rowName }: { rowName: string }) {
    delete this.rowInfoMap[rowName];
  }

  addRowInfo({ rowName, rowInfo }: { rowName: string; rowInfo: RowInfo }) {
    this.rowInfoMap[rowName] = rowInfo;
  }

  updateRowInfo({ rowName, rowInfo }: { rowName: string; rowInfo: RowInfo }) {
    this.rowInfoMap[rowName] = rowInfo;
  }

  countTotalPlayers() {
    return Object.keys(this.playerMap).length;
  }

  getPlayerNames() {
    return Object.keys(this.playerMap);
  }

  static generateDiceEye() {
    const eyes = [1, 2, 3, 4, 5, 6] as const;
    return eyes[Math.floor(Math.random() * eyes.length)]!;
  }

  getBasePlayerTotalScore({ playerName }: { playerName: string }) {
    const handInputMap = this.getHandInputMapOf(playerName);

    let totalScore = 0;
    Object.keys(this.rowInfoMap).forEach((rowName) => {
      const rowInfo = this.rowInfoMap[rowName]!;
      totalScore += rowInfo.getScoreFrom({ handInputMap });
    });

    return totalScore;
  }

  getPlayerTotalScore({ playerName }: { playerName: string }) {
    return this.getBasePlayerTotalScore({ playerName });
  }

  isFinishedBase() {
    const totalHands = this.countTotalHand();
    return this.countFilledCells() >= totalHands * this.countTotalPlayers();
  }

  isFinished() {
    return this.isFinishedBase();
  }

  triggerAlterOption(alterOptionName: string) {
    const alterOption = AlterOptionMap[alterOptionName];
    if (alterOption === undefined) throw new Error("No alterOption");

    alterOption.onTrigger(this);
  }

  /** Extracts the relevant data part from the game status */
  extractDataPart(): GameDBPart {
    return {
      alterOptionMetaInfoList: this.alterOptionMetaInfoList,
      currentPlayerName: this.currentPlayerName,
      diceSet: this.diceSet,
      playerInfoMap: this.playerMap,
      remainingRoll: this.remainingRoll,
    };
  }

  countTotalHand() {
    const playerMap = this.playerMap;
    const hands = Object.values(playerMap)[0]!.handInputMap;
    return Object.keys(hands).length;
  }

  countTotalRow() {
    const rowInfoMap = this.rowInfoMap;
    const rows = Object.keys(rowInfoMap);
    return rows.length;
  }

  getTotalTurn() {
    return this.countTotalRow();
  }

  getCurrentTurn() {
    const filledCells = this.countFilledCells();
    const totalPlayers = this.countTotalPlayers();
    return Math.floor(filledCells / totalPlayers) + 1;
  }

  countFilledCells() {
    let filledRowNum = 0;
    Object.values(this.playerMap).forEach((playerMap) => {
      Object.values(playerMap.handInputMap).forEach((selection) => {
        if (selection !== null) {
          filledRowNum += 1;
        }
      });
    });
    return filledRowNum;
  }

  getCurrentPlayerName() {
    return this.currentPlayerName;
  }

  getClone() {
    return _.cloneDeep(this);
  }

  getShallowClone() {
    return _.clone(this);
  }

  constructor(dbPart: GameDBPart) {
    this.alterOptionMetaInfoList = dbPart.alterOptionMetaInfoList;
    this.currentPlayerName = dbPart.currentPlayerName;
    this.diceSet = dbPart.diceSet;
    this.playerMap = dbPart.playerInfoMap;
    this.remainingRoll = dbPart.remainingRoll;

    this.maxHolding = 5;
    this.maxRoll = 3;
    this.rowInfoMap = getInitialRowInfo();
  }
}
