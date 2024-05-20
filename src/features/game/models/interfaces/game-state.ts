import { Square, TakenSquare } from '.';
import { Set } from '../enums';
import { Checkerboard, MovePath } from '../types';
import { Settings, RuleSet } from './game-settings';

export interface GameState {
  settings: Settings;
  rules: RuleSet;
  player1: Player;
  player2: Player;
  checkerboard: Checkerboard;
  uiCheckerboard: Checkerboard;
  turn: Set;
  isCaptureTurn: boolean;
  winner: Set | null;
  selectedSquare: Square | null;
  activeSquare: TakenSquare | null;
  currentPaths: MovePath[];
  remainingLights: number;
  remainingDarks: number;
}

export interface Player {
  name: string;
  set: Set;
  isComputer: boolean;
  elapsedTime: number;
  remainingTime: number;
}
