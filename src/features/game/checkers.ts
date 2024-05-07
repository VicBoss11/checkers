import { SQUARES_PER_SIDE } from './helpers/constants';
import { Set } from './models/enums';
import { Piece, Position, Square, TakenSquare } from './models/interfaces';
import { Checkerboard, MovePath } from './models/types';

export function move(
  from: TakenSquare,
  to: Square,
  checkerboard: Checkerboard
): Checkerboard {
  const updatedCheckerboard = checkerboard.map((row) =>
    row.map((square) => ({ ...square }))
  );

  const { rowIndex: fromRowIndex, columnIndex: fromColumnIndex } =
    from.position;

  const { rowIndex: toRowIndex, columnIndex: toColumnIndex } = to.position;

  const piece: Piece = {
    ...updatedCheckerboard[fromRowIndex][fromColumnIndex].takenBy!,
  };

  updatedCheckerboard[fromRowIndex][fromColumnIndex].takenBy = null;
  updatedCheckerboard[toRowIndex][toColumnIndex].takenBy = piece;

  return updatedCheckerboard;
}

export function isPieceMovable(
  piece: Piece,
  possibleMoves: MovePath[],
  turn: Set
): boolean {
  return (
    turn === piece.set && // The turn corresponds to the color of the piece
    possibleMoves.length > 0 // There are possible moves
  );
}

export function getPossibleMoves(
  square: TakenSquare,
  checkerboard: Checkerboard,
  turn: Set
): MovePath[] {
  const possibleMoves: MovePath[] = [];

  if (square.takenBy.set !== turn) {
    return possibleMoves;
  }

  addValidMoves(square, turn, checkerboard, possibleMoves);

  return possibleMoves;
}

function addValidMoves(
  square: Square,
  set: Set,
  checkerboard: Checkerboard,
  possibleMoves: MovePath[],
  currentMovePath: MovePath = [],
  isCaptureMove = false
): void {
  const { forwardRow, columnOffsets } = calculateMoveOffsets(
    set,
    square.position
  );

  for (const columnOffset of columnOffsets) {
    if (isWithinCheckerboardBounds(forwardRow, columnOffset)) {
      const targetSquare = checkerboard[forwardRow][columnOffset];

      addValidMovesOf(
        { currentSquare: square, targetSquare },
        set,
        checkerboard,
        possibleMoves,
        currentMovePath,
        isCaptureMove
      );
    }
  }
}

function addValidMovesOf(
  {
    currentSquare,
    targetSquare,
  }: { currentSquare: Square; targetSquare: Square },
  set: Set,
  checkerboard: Checkerboard,
  possibleMoves: MovePath[],
  currentMovePath: MovePath = [],
  isCaptureMove = false
): void {
  if (!targetSquare.takenBy && !isCaptureMove) {
    const newMovePath: MovePath = [...currentMovePath, targetSquare];

    possibleMoves.push(newMovePath);

    return;
  }

  if (targetSquare.takenBy?.set === set) {
    return;
  }

  const { rowIndex: oppositeRowIndex, columnIndex: oppositeColumnIndex } =
    calculateDiagonalOffset(currentSquare.position, targetSquare.position);

  if (
    isWithinCheckerboardBounds(oppositeRowIndex, oppositeColumnIndex) &&
    !checkerboard[oppositeRowIndex][oppositeColumnIndex].takenBy
  ) {
    const newTargetSquare = checkerboard[oppositeRowIndex][oppositeColumnIndex];
    const newMovePath: MovePath = [...currentMovePath, newTargetSquare];
    const captureMode = true;

    possibleMoves.push(newMovePath);

    addValidMoves(
      newTargetSquare,
      set,
      checkerboard,
      possibleMoves,
      newMovePath,
      captureMode
    );
  }
}

function isWithinCheckerboardBounds(i: number, j: number): boolean {
  return i >= 0 && i < SQUARES_PER_SIDE && j >= 0 && j < SQUARES_PER_SIDE;
}

function calculateMoveOffsets(
  turn: Set,
  { rowIndex, columnIndex }: Position
): { forwardRow: number; columnOffsets: [number, number] } {
  const isLightSet = turn === Set.Light;

  const forwardRow = isLightSet ? rowIndex - 1 : rowIndex + 1;
  const leftColumn = isLightSet ? columnIndex - 1 : columnIndex + 1;
  const rightColumn = isLightSet ? columnIndex + 1 : columnIndex - 1;

  return { forwardRow, columnOffsets: [leftColumn, rightColumn] };
}

function calculateDiagonalOffset(
  { rowIndex: startRowIndex, columnIndex: startColumnIndex }: Position,
  { rowIndex: endRowIndex, columnIndex: endColumnIndex }: Position
): Position {
  const deltaRow = endRowIndex - startRowIndex;
  const deltaColumn = endColumnIndex - startColumnIndex;

  const oppositeRowIndex = endRowIndex + deltaRow;
  const oppositeColumnIndex = endColumnIndex + deltaColumn;

  return { rowIndex: oppositeRowIndex, columnIndex: oppositeColumnIndex };
}
