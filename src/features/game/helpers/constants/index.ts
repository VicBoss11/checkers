import { GameMode, Set } from '../../models/enums';
import { Settings, RuleSet } from '../../models/interfaces/game-settings';
import { Player } from '../../models/interfaces/game-state';

export const DEFAULT_SETTINGS: Settings = {
  gameMode: GameMode.Local,
  // TODO: Set to false
  showCompletePaths: true,
  drawRequestEnabled: true,
  showCheckerboardCoordinates: true,
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
    set: Set.Light,
    isComputer: false,
    elapsedTime: 0,
    remainingTime: DEFAULT_RULES.timeLimit,
  },
  {
    name: 'Player 2',
    set: Set.Dark,
    isComputer: false,
    elapsedTime: 0,
    remainingTime: DEFAULT_RULES.timeLimit,
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

export const DEFAULT_REMAINIG_LIGHT_PIECES =
  DEFAULT_PIECES_LOCATION_TEMPLATE.flat().filter(
    (piece) => piece === Set.Light
  ).length;

export const DEFAULT_REMAINIG_DARK_PIECES =
  DEFAULT_PIECES_LOCATION_TEMPLATE.flat().filter(
    (piece) => piece === Set.Dark
  ).length;
