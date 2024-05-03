import { SQUARES_PER_SIDE } from './helpers/constants';
import { Set } from './models/enums';
import { Piece, Position, Square, TakenSquare } from './models/interfaces';
import { Checkerboard } from './models/types';

export function getPossibleMoves(
  selectedSquare: Square,
  checkerboard: Checkerboard
): Square[][] {
  const possibleMoves: Square[][] = [];
  const piece = selectedSquare.takenBy;

  // If the square doesn't contain a piece, there are no possible moves
  if (!piece) {
    return possibleMoves;
  }

  const isLightSet = piece.set === Set.Light;
  const { rowIndex: i, columnIndex: j } = selectedSquare.position;

  // TODO: Uncomment the following lines if backward moves are allowed
  // Check forward and backward moves
  // const forwardRow = isLightSet ? i - 1 : i + 1;
  // const backwardRow = isLightSet ? i + 1 : i - 1;

  // Check forward moves
  const forwardRow = isLightSet ? i - 1 : i + 1;
  // Check diagonal moves
  const leftColumn = isLightSet ? j - 1 : j + 1;
  const rightColumn = isLightSet ? j + 1 : j - 1;

  addValidMoves(
    { rowIndex: forwardRow, columnIndex: leftColumn },
    selectedSquare as TakenSquare,
    checkerboard,
    [],
    possibleMoves
  );

  addValidMoves(
    { rowIndex: forwardRow, columnIndex: rightColumn },
    selectedSquare as TakenSquare,
    checkerboard,
    [],
    possibleMoves
  );

  // TODO: Uncomment the following lines if backward moves are allowed
  // if (rule.backwards) {
  //   addValidMoves(
  //     { rowIndex: backwardRow, columnIndex: leftColumn },
  //     selectedSquare as SquareTaken,
  //     checkerboard,
  //     [],
  //     possibleMoves
  //   );

  //   addValidMoves(
  //     { rowIndex: backwardRow, columnIndex: rightColumn },
  //     selectedSquare as SquareTaken,
  //     checkerboard,
  //     [],
  //     possibleMoves
  //   );
  // }

  return possibleMoves;
}

// Recursive function to obtain all possible valid moves of a square
function addValidMoves(
  targetPosition: Position, // The position to check
  selectedSquare: TakenSquare, // The current selected square
  checkerboard: Checkerboard,
  currentPathMoves: Square[], // An array with all the moves of the current path
  possibleMoves: Square[][] // An array that stores all move paths
) {
  const { rowIndex: i, columnIndex: j } = targetPosition;
  const isWithinCheckerboardBounds =
    i >= 0 && i < SQUARES_PER_SIDE && j >= 0 && j < SQUARES_PER_SIDE;

  if (!isWithinCheckerboardBounds) {
    return;
  }

  const targetSquare = checkerboard[i][j];

  if (!targetSquare.takenBy) {
    const newPath = [...currentPathMoves, targetSquare];

    possibleMoves.push(newPath);

    return;
  }

  if (targetSquare.takenBy.set !== selectedSquare.takenBy.set) {
    const newPath = [...currentPathMoves, targetSquare];

    possibleMoves.push(newPath);

    const isLightSet = selectedSquare.takenBy.set === Set.Light;

    const forwardRow = isLightSet ? i - 1 : i + 1;
    const leftColumn = isLightSet ? j - 1 : j + 1;
    const rightColumn = isLightSet ? j + 1 : j - 1;

    addValidMoves(
      { rowIndex: forwardRow, columnIndex: leftColumn },
      targetSquare as TakenSquare,
      checkerboard,
      newPath,
      possibleMoves
    );

    addValidMoves(
      { rowIndex: forwardRow, columnIndex: rightColumn },
      targetSquare as TakenSquare,
      checkerboard,
      newPath,
      possibleMoves
    );
  }
}

export function checkIsMovablePiece(
  piece: Piece,
  possibleMoves: Square[][],
  turn: Set
): boolean {
  return (
    turn === piece.set && // The turn corresponds to the color of the piece
    possibleMoves.length > 0 // There are possible moves
  );
}
