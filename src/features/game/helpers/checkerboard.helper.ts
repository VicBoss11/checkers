import {
  DEFAULT_PIECES_LOCATION_TEMPLATE,
  SQUARES_PER_SIDE,
} from './constants';
import { Piece, Position, Square } from '../models/interfaces';
import { Checkerboard, Color } from '../models/types';
import { Set } from '../models/enums';

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

      // Since the checkerboard is going to be reversed,
      // we have to calculate the opposite row index
      const oppositeRowIndex = SQUARES_PER_SIDE - 1 - i;

      const position: Position = { rowIndex: oppositeRowIndex, columnIndex: j };
      const location = `${String.fromCharCode(64 + y)}${x}`;
      const color: Color = setSquareColor(x, y);
      const isPlayable = color === 'dark';
      const takenBy: Piece | null =
        defaultTemplateSquareValue !== null
          ? {
              id: pieceId++,
              position,
              location,
              set: defaultTemplateSquareValue === 0 ? Set.Light : Set.Dark,
              isKing: false,
            }
          : null;

      const square: Square = {
        id: squareId++,
        position,
        location,
        color,
        isPlayable,
        takenBy,
      };

      row.push(square);
    }

    checkerboard.push(row);
  }

  return checkerboard.reverse();
}
