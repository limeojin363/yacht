import { getInitialGameStatus, type GameStatus } from 'common/default-game';
import { atomWithLazy } from 'jotai/utils'

const defaultGameRootAtom = atomWithLazy<GameStatus>(getInitialGameStatus);

export default defaultGameRootAtom;
