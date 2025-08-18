import { atom } from "jotai";
import gameRootAtom from ".";

export const remainingRollAtom = atom((get) => get(gameRootAtom).remainingRoll);
