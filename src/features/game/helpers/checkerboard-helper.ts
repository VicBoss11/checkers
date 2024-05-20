import { DEFAULT_PIECES_LOCATION_TEMPLATE } from '../constants/checkers-default';
import { Piece, Position, Square } from '../models/interfaces/checkers';
import { Checkerboard, SquareColor } from '../models/types/checkers';
import { PieceType, PieceSet } from '../models/enums/checkers';
import { SQUARES_PER_SIDE } from '../constants/checkers';

function setSquareColor(row: number, column: number): SquareColor {
  return (row + column) % 2 === 0 ? 'dark' : 'light';
}

function buildDefaultCheckerboard(): Checkerboard {
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
      const color: SquareColor = setSquareColor(x, y);
      const isPlayable = color === 'dark';
      const takenBy: Piece | null =
        defaultTemplateSquareValue !== null
          ? {
              id: pieceId++,
              position,
              location,
              type: PieceType.NonKing,
              set:
                defaultTemplateSquareValue === 0
                  ? PieceSet.Light
                  : PieceSet.Dark,
              isKing: false,
            }
          : null;

      const square: Square = {
        id: squareId++,
        position,
        location,
        color,
        takenBy,
        isPlayable,
        isPossibleMove: false,
        isImmediateMove: false,
      };

      row.push(square);
    }

    checkerboard.push(row);
  }

  return checkerboard.reverse();
}

export default buildDefaultCheckerboard;
