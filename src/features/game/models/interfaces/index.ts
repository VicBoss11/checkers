import { Set } from '../enums';

export interface Square {
  id: number;
  position: Position;
  location: string;
  color: string;
  isPlayable: boolean;
  takenBy: Piece | null;
  isPossibleMove: boolean;
  isImmediateMove: boolean;
}

export interface TakenSquare extends Square {
  takenBy: Piece;
}

export interface Piece {
  id: number;
  position: Position;
  location: string;
  set: Set;
  isKing: boolean;
}

export interface Position {
  rowIndex: number;
  columnIndex: number;
}
