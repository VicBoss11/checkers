import {
  DEFAULT_PLAYERS,
  DEFAULT_REMAINIG_LIGHT_PIECES,
  DEFAULT_RULES,
  DEFAULT_SETTINGS,
} from '.';
import { Set } from '../../models/enums';
import { CheckersContext } from '../../models/interfaces/game-context';
import { GameState } from '../../models/interfaces/game-state';

const DEFAULT_GAME_STATE: GameState = {
  settings: DEFAULT_SETTINGS,
  rules: DEFAULT_RULES,
  player1: DEFAULT_PLAYERS[0],
  player2: DEFAULT_PLAYERS[1],
  checkerboard: [],
  uiCheckerboard: [],
  turn: Set.Light,
  isCaptureTurn: false,
  winner: null,
  selectedSquare: null,
  activeSquare: null,
  currentPaths: [],
  remainingLights: DEFAULT_REMAINIG_LIGHT_PIECES,
  remainingDarks: DEFAULT_REMAINIG_LIGHT_PIECES,
};

const DEFAULT_SET_FUNCTIONS = {
  setSettings: () => DEFAULT_SETTINGS,
  setRules: () => DEFAULT_RULES,
  setPlayer1: () => DEFAULT_PLAYERS[0],
  setPlayer2: () => DEFAULT_PLAYERS[1],
  setCheckerboard: () => [],
  setUiCheckerboard: () => [],
  setTurn: () => Set.Light,
  setIsCaptureTurn: () => false,
  setWinner: () => null,
  setSelectedSquare: () => null,
  setActiveSquare: () => null,
  setCurrentPaths: () => [],
  setRemainingLights: () => DEFAULT_REMAINIG_LIGHT_PIECES,
  setRemainingDarks: () => DEFAULT_REMAINIG_LIGHT_PIECES,
};

export const DEFAULT_CHECKERS_CONTEXT: CheckersContext = {
  gameState: DEFAULT_GAME_STATE,
  setFunctions: DEFAULT_SET_FUNCTIONS,
};
