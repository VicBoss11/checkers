import {
  DEFAULT_PIECES_LOCATION_TEMPLATE,
  SQUARES_PER_SIDE,
} from './constants';
import { Piece, Square } from '../models/interfaces';
import { Checkerboard, Color } from '../models/types';

function setSquareColor(row: number, column: number): Color {
  return (row + column) % 2 === 0 ? 'dark' : 'light';
}

export function buildDefaultCheckerboard(): Checkerboard {
  const checkerboard: Checkerboard = [];

  let squareId = 1;
  let pieceId = 1;

  for (let i = 0; i < SQUARES_PER_SIDE; i++) {
    const row: Square[] = [];

    for (let j = 0; j < SQUARES_PER_SIDE; j++) {
      const x = i + 1;
      const y = j + 1;

      const defaultTemplateSquareValue: number | null =
        DEFAULT_PIECES_LOCATION_TEMPLATE[i][j];

      const coordinate = `${String.fromCharCode(64 + y)}${x}`;
      const color: Color = setSquareColor(x, y);
      const takenBy: Piece | null =
        defaultTemplateSquareValue !== null
          ? {
              id: pieceId++,
              coordinate,
              set: defaultTemplateSquareValue === 0 ? 'light' : 'dark',
              isKing: false,
            }
          : null;

      const square: Square = {
        id: squareId++,
        coordinate,
        color,
        takenBy,
      };

      row.push(square);
    }

    checkerboard.push(row);
  }

  return checkerboard.reverse();
}
