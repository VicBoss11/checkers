import { PieceSet } from '../enums/checkers';
import { Checkerboard, MovePath } from '../types/checkers';
import { Settings, RuleSet } from './checkers-settings';
import { Player, Square, TakenSquare } from './checkers';

export interface GameState {
  settings: Settings;
  rules: RuleSet;
  player1: Player;
  player2: Player;
  checkerboard: Checkerboard;
  uiCheckerboard: Checkerboard;
  turn: PieceSet;
  isCaptureTurn: boolean;
  winner: PieceSet | null;
  selectedSquare: Square | null;
  activeSquare: TakenSquare | null;
  currentPaths: MovePath[];
  lightsRemaining: number;
  darksRemaining: number;
  lightKingsCount: number;
  darkKingsCount: number;
}
