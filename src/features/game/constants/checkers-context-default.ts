import {
  DEFAULT_PLAYERS,
  DEFAULT_LIGHT_PIECES_REMAINIG,
  DEFAULT_RULES,
  DEFAULT_SETTINGS,
} from './checkers-default';
import { PieceSet } from '../models/enums/checkers';
import { CheckersContext } from '../models/interfaces/checkers-context';
import { GameState } from '../models/interfaces/game-state';

const DEFAULT_GAME_STATE: GameState = {
  settings: DEFAULT_SETTINGS,
  rules: DEFAULT_RULES,
  player1: DEFAULT_PLAYERS[0],
  player2: DEFAULT_PLAYERS[1],
  checkerboard: [],
  uiCheckerboard: [],
  turn: PieceSet.Light,
  isCaptureTurn: false,
  winner: null,
  selectedSquare: null,
  activeSquare: null,
  currentPaths: [],
  moveHistory: [],
  lightsRemaining: DEFAULT_LIGHT_PIECES_REMAINIG,
  darksRemaining: DEFAULT_LIGHT_PIECES_REMAINIG,
  lightKingsCount: 0,
  darkKingsCount: 0,
};

const DEFAULT_SET_FUNCTIONS = {
  setSettings: () => DEFAULT_SETTINGS,
  setRules: () => DEFAULT_RULES,
  setPlayer1: () => DEFAULT_PLAYERS[0],
  setPlayer2: () => DEFAULT_PLAYERS[1],
  setCheckerboard: () => [],
  setUiCheckerboard: () => [],
  setTurn: () => PieceSet.Light,
  setIsCaptureTurn: () => false,
  setWinner: () => null,
  setSelectedSquare: () => null,
  setActiveSquare: () => null,
  setCurrentPaths: () => [],
  setMoveHistory: () => [],
  setLightsRemaining: () => DEFAULT_LIGHT_PIECES_REMAINIG,
  setDarksRemaining: () => DEFAULT_LIGHT_PIECES_REMAINIG,
  setLightKingsCount: () => 0,
  setDarkKingsCount: () => 0,
};

export const DEFAULT_CHECKERS_CONTEXT: CheckersContext = {
  gameState: DEFAULT_GAME_STATE,
  setFunctions: DEFAULT_SET_FUNCTIONS,
};
