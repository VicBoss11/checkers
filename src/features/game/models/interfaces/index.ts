import { Color } from '../types';

export interface Square {
  id: number;
  coordinate: string;
  color: string;
  takenBy: Piece | null;
}

export interface Piece {
  id: number;
  coordinate: string;
  set: Color;
  isKing: boolean;
}
