import { GameMode } from '../enums/game-state';

export interface Settings {
  gameMode: GameMode;
  showCompletePaths: boolean;
  drawRequestEnabled: boolean;
  showCheckerboardGuides: boolean;
  deepMode: boolean;
}

export interface RuleSet {
  captureRequired: boolean;
  bestCapturePathRequired: boolean;
  blowEnabled: boolean;
  kingSingleStepEnabled: boolean;
  timeLimitEnabled: boolean;
  timeLimit: number;
  movesWithoutCaptureLimitEnabled: boolean;
  movesWithoutCaptureLimit: number;
}
