import _ from "lodash";
import { getInitialRowInfo } from "../score";
import type {
  DiceEyes,
  GameDBPart,
  RowInfo,
  UnusableDiceSet,
  UsableDiceSet,
} from "./types";
import { AlterOptionMap, generateAlterOptions } from "../alter-options";

// 유저가 넣는 칸이 hand고, 계산 시 나오는 결과가 row다.
// 대체로 hand == row이지만 예외가 있다.
// Ex) Fusion Row의 경우 hand 두 개로 구성
export class Game {
  diceSet: GameDBPart["diceSet"];
  remainingRoll: GameDBPart["remainingRoll"];
  currentPlayerIdx: GameDBPart["currentPlayerIdx"];
  playerInfoList: GameDBPart["playerInfoList"];
  alterOptionMetaInfoList: GameDBPart["alterOptionMetaInfoList"];

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

  getPlayerInfoOf({ playerIdx }: { playerIdx: number }) {
    const playerInfo = this.playerInfoList[playerIdx];
    if (playerInfo === undefined) throw new Error("No such player");
    return playerInfo;
  }

  getColorOf({ playerIdx }: { playerIdx: number }) {
    return this.getPlayerInfoOf({ playerIdx }).color;
  }

  getPlayerNameList() {
    return Object.keys(this.playerInfoList);
  }

  getHandInputMapOf({ playerIdx }: { playerIdx: number }) {
    return this.getPlayerInfoOf({ playerIdx }).handInputMap;
  }

  getHandOf({ handName, playerIdx }: { handName: string; playerIdx: number }) {
    const handInputMap = this.getHandInputMapOf({ playerIdx });
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
    Object.values(this.playerInfoList).forEach((playerInfo) => {
      delete playerInfo.handInputMap[handName];
    });
  }

  addHand({ handName }: { handName: string }) {
    Object.values(this.playerInfoList).forEach((playerInfo) => {
      playerInfo.handInputMap[handName] = null;
    });
  }

  checkAlterOptions() {
    this.alterOptionMetaInfoList.forEach((alterOption) => {
      if (!alterOption.revealed && this.getCurrentTurn() >= alterOption.turn) {
        alterOption.revealed = true;
        this.triggerAlterOption(alterOption.name);
      }
    });
  }

  enterUserHandInput({ handName, eyes }: { handName: string; eyes: DiceEyes }) {
    const playerInfo = this.playerInfoList[this.currentPlayerIdx];
    if (playerInfo === undefined) throw new Error("No such player");

    if (playerInfo.handInputMap[handName] === undefined)
      throw new Error("No such hand");

    if (playerInfo.handInputMap[handName] !== null)
      throw new Error("Hand is already filled");

    playerInfo.handInputMap[handName] = eyes;

    this.checkAlterOptions();

    this.currentPlayerIdx =
      (this.currentPlayerIdx + 1) % this.countTotalPlayers();
    this.remainingRoll = this.maxRoll;
    this.diceSet = [null, null, null, null, null];
  }

  getScoreOf({ rowName, playerIdx }: { rowName: string; playerIdx: number }) {
    const handInputMap = this.getHandInputMapOf({ playerIdx });
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
    return Object.keys(this.playerInfoList).length;
  }

  static generateDiceEye() {
    const eyes = [1, 2, 3, 4, 5, 6] as const;
    return eyes[Math.floor(Math.random() * eyes.length)]!;
  }

  getBasePlayerTotalScore({ playerIdx }: { playerIdx: number }) {
    const handInputMap = this.getHandInputMapOf({ playerIdx });

    let totalScore = 0;
    Object.keys(this.rowInfoMap).forEach((rowName) => {
      const rowInfo = this.rowInfoMap[rowName]!;
      totalScore += rowInfo.getScoreFrom({ handInputMap });
    });

    return totalScore;
  }

  getPlayerTotalScore({ playerIdx }: { playerIdx: number }) {
    return this.getBasePlayerTotalScore({ playerIdx });
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
      currentPlayerIdx: this.currentPlayerIdx,
      diceSet: this.diceSet,
      playerInfoList: this.playerInfoList,
      remainingRoll: this.remainingRoll,
    };
  }

  countTotalHand() {
    const playerMap = this.playerInfoList;
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
    Object.values(this.playerInfoList).forEach((playerMap) => {
      Object.values(playerMap.handInputMap).forEach((selection) => {
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

  static getInitialDiceSet(): UnusableDiceSet {
    return [null, null, null, null, null];
  }

  constructor(dbPart: GameDBPart) {
    this.maxHolding = 5;
    this.maxRoll = 3;
    this.rowInfoMap = getInitialRowInfo();

    this.alterOptionMetaInfoList = dbPart.alterOptionMetaInfoList;
    this.currentPlayerIdx = dbPart.currentPlayerIdx;
    this.diceSet = dbPart.diceSet;
    this.playerInfoList = dbPart.playerInfoList;
    this.remainingRoll = dbPart.remainingRoll;

    this.checkAlterOptions();
  }
}
