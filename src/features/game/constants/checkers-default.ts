import { PieceSet } from '../models/enums/checkers';
import { GameMode } from '../models/enums/game-state';
import { Player } from '../models/interfaces/checkers';
import { Settings, RuleSet } from '../models/interfaces/checkers-settings';

export const DEFAULT_SETTINGS: Settings = {
  gameMode: GameMode.Local,
  // TODO: Set to false
  showCompletePaths: true,
  drawRequestEnabled: true,
  showCheckerboardGuides: true,
  deepMode: false,
};

export const DEFAULT_RULES: RuleSet = {
  captureRequired: false,
  bestCapturePathRequired: false,
  blowEnabled: false,
  kingSingleStepEnabled: false,
  timeLimitEnabled: false,
  timeLimit: 300,
  movesWithoutCaptureLimitEnabled: false,
  movesWithoutCaptureLimit: 10,
};

export const DEFAULT_PLAYERS: Player[] = [
  {
    name: 'Player 1',
    set: PieceSet.Light,
    isComputer: false,
    timeElapsed: 0,
    timeRemaining: DEFAULT_RULES.timeLimit,
  },
  {
    name: 'Player 2',
    set: PieceSet.Dark,
    isComputer: false,
    timeElapsed: 0,
    timeRemaining: DEFAULT_RULES.timeLimit,
  },
];

export const DEFAULT_PIECES_LOCATION_TEMPLATE = [
  [0, null, 0, null, 0, null, 0, null],
  [null, 0, null, 0, null, 0, null, 0],
  [0, null, 0, null, 0, null, 0, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, 1, null, 1, null, 1, null, 1],
  [1, null, 1, null, 1, null, 1, null],
  [null, 1, null, 1, null, 1, null, 1],
];

export const DEFAULT_LIGHT_PIECES_REMAINIG =
  DEFAULT_PIECES_LOCATION_TEMPLATE.flat().filter(
    (piece) => piece === PieceSet.Light
  ).length;

export const DEFAULT_DARK_PIECES_REMAINIG =
  DEFAULT_PIECES_LOCATION_TEMPLATE.flat().filter(
    (piece) => piece === PieceSet.Dark
  ).length;
