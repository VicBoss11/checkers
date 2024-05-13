import { SQUARES_PER_SIDE } from './helpers/constants';
import { Set } from './models/enums';
import {
  Piece,
  Position,
  TakenSquare,
  Move,
  Square,
} from './models/interfaces';
import { Checkerboard, MovePath } from './models/types';

export function move(
  fromSquare: TakenSquare,
  toSquare: Square,
  checkerboard: Checkerboard
): Checkerboard {
  const updatedCheckerboard = cloneCheckerboard(checkerboard);

  const { rowIndex: fromRowIndex, columnIndex: fromColumnIndex } =
    fromSquare.position;

  const { rowIndex: toRowIndex, columnIndex: toColumnIndex } =
    toSquare.position;

  const piece: Piece = { ...fromSquare.takenBy };

  updatedCheckerboard[fromRowIndex][fromColumnIndex].takenBy = null;
  updatedCheckerboard[toRowIndex][toColumnIndex].takenBy = piece;

  if (
    !piece.isKing &&
    isKingCandidate(
      updatedCheckerboard[toRowIndex][toColumnIndex] as TakenSquare
    )
  ) {
    updatedCheckerboard[toRowIndex][toColumnIndex].takenBy =
      promoteToKing(piece);
  }

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

export function cloneCheckerboard(checkerboard: Checkerboard): Checkerboard {
  return checkerboard.map((row) => row.map((square) => ({ ...square })));
}

export function getPossibleMovePaths(
  square: TakenSquare,
  checkerboard: Checkerboard,
  turn: Set
): MovePath[] {
  const possiblePaths: MovePath[] = [];

  if (square.takenBy.set !== turn) {
    return possiblePaths;
  }

  addValidMoves(square, checkerboard, possiblePaths);
  // TODO: Consider rule for accessibility
  addValidChainedMoves(square, checkerboard, possiblePaths);

  return possiblePaths;
}

function addValidMoves(
  selectedSquare: TakenSquare,
  checkerboard: Checkerboard,
  possiblePaths: MovePath[]
): void {
  const set = selectedSquare.takenBy.set;
  const isKing = selectedSquare.takenBy.isKing;

  const { rowOffsets, columnOffsets } = isKing
    ? calculateKingMoveOffsets(selectedSquare.position)
    : calculateMoveOffsets(set, selectedSquare.position);

  for (const rowIndex of rowOffsets) {
    for (const columnIndex of columnOffsets) {
      const moves: Move[] = [];

      let currentSquare: Square = selectedSquare;
      let currentRowIndex: number = rowIndex;
      let currentColumnIndex: number = columnIndex;

      let capturedSquare: TakenSquare | null = null;
      let isCaptureMove = false;
      let enemyFoundCounter = 0;

      while (isWithinCheckerboardBounds(currentRowIndex, currentColumnIndex)) {
        const targetSquare: Square =
          checkerboard[currentRowIndex][currentColumnIndex];

        if (targetSquare.takenBy) {
          if (targetSquare.takenBy.set !== set) {
            enemyFoundCounter++;

            if (enemyFoundCounter === 1) {
              capturedSquare = targetSquare as TakenSquare;
              isCaptureMove = true;
            }
          } else {
            break;
          }
        } else {
          const move: Move = {
            square: targetSquare,
            capturedSquare,
            isCaptureMove,
            isImmediateMove: true,
          };

          moves.push(move);

          if (!isKing) {
            break;
          }
        }

        if (enemyFoundCounter > 1) {
          break;
        }

        const { rowIndex: newRowIndex, columnIndex: newColumnIndex } =
          calculateDiagonalOffset(
            currentSquare.position,
            targetSquare.position
          );

        currentSquare = targetSquare;
        currentRowIndex = newRowIndex;
        currentColumnIndex = newColumnIndex;
      }

      for (const move of moves) {
        possiblePaths.push([move]);
      }
    }
  }
}

function addValidChainedMoves(
  selectedSquare: TakenSquare,
  checkerboard: Checkerboard,
  possiblePaths: MovePath[]
): void {
  const capturePaths: MovePath[] = getCapturePaths(possiblePaths);

  if (capturePaths.length === 0) {
    return;
  }

  const chainedPaths: MovePath[] = selectedSquare.takenBy.isKing
    ? getKingChainedPaths(selectedSquare, checkerboard, capturePaths)
    : getChainedPaths(selectedSquare, checkerboard, capturePaths);

  possiblePaths.push(...chainedPaths);
}

function getCapturePaths(possiblePaths: MovePath[]): MovePath[] {
  return possiblePaths.filter((path) =>
    path.some((move) => move.isCaptureMove)
  );
}

function getChainedPaths(
  selectedSquare: TakenSquare,
  checkerboard: Checkerboard,
  capturePaths: MovePath[],
  possiblePaths: MovePath[] = []
): MovePath[] {
  const chainedPaths: MovePath[] = [];

  if (capturePaths.length === 0) {
    return possiblePaths;
  }

  for (const path of capturePaths) {
    const lastCaptureMove: Move = path[path.length - 1];

    // Create a virtual checkerboard to simulate captures
    const virtualCheckerboard = cloneCheckerboard(checkerboard);

    // Remove captured pieces from the virtual checkerboard
    for (const captureMove of path) {
      const { rowIndex, columnIndex } = captureMove.capturedSquare!.position;

      virtualCheckerboard[rowIndex][columnIndex].takenBy = null;
    }

    // TODO: Important! Refactor this to get the function with a dictionary
    const newPossibleMoves: Move[] = getPossibleMovesVirtually(
      lastCaptureMove.square,
      virtualCheckerboard,
      {
        virtualSquareSet: selectedSquare.takenBy.set,
        virtualSquareIsKing: false,
      }
    );

    // Since the last element of the path doesn't add any new movements,
    // the path is added to the possible move paths
    if (newPossibleMoves.length === 0) {
      possiblePaths.push(path);
    }

    for (const newPossibleMove of newPossibleMoves) {
      const newPath: MovePath = [...path];

      newPath.push(newPossibleMove);

      chainedPaths.push(newPath);
    }
  }

  return getKingChainedPaths(
    selectedSquare,
    checkerboard,
    chainedPaths,
    possiblePaths
  );
}

function getKingChainedPaths(
  selectedSquare: TakenSquare,
  checkerboard: Checkerboard,
  capturePaths: MovePath[],
  possiblePaths: MovePath[] = []
): MovePath[] {
  const chainedPaths: MovePath[] = [];

  if (capturePaths.length === 0) {
    return possiblePaths;
  }

  for (const path of capturePaths) {
    const lastCaptureMove: Move = path[path.length - 1];

    // Create a virtual checkerboard to simulate captures
    const virtualCheckerboard = cloneCheckerboard(checkerboard);

    // Remove captured pieces from the virtual checkerboard
    for (const captureMove of path) {
      const { rowIndex, columnIndex } = captureMove.capturedSquare!.position;

      virtualCheckerboard[rowIndex][columnIndex].takenBy = null;
    }

    // TODO: Important! Refactor this to get the function with a dictionary
    const newPossibleMoves: Move[] = getKingPossibleMovesVirtually(
      lastCaptureMove.square,
      virtualCheckerboard,
      {
        virtualSquareSet: selectedSquare.takenBy.set,
        virtualSquareIsKing: true,
      }
    );

    // Since the last element of the path doesn't add any new movements,
    // the path is added to the possible move paths
    if (newPossibleMoves.length === 0) {
      possiblePaths.push(path);
    }

    for (const newPossibleMove of newPossibleMoves) {
      const newPath: MovePath = [...path];

      newPath.push(newPossibleMove);

      chainedPaths.push(newPath);
    }
  }

  return getKingChainedPaths(
    selectedSquare,
    checkerboard,
    chainedPaths,
    possiblePaths
  );
}

function getPossibleMovesVirtually(
  square: Square,
  checkerboard: Checkerboard,
  {
    virtualSquareSet,
    virtualSquareIsKing,
  }: { virtualSquareSet: Set; virtualSquareIsKing: boolean }
): Move[] {
  const possibleMoves: Move[] = [];

  const virtualSquare: TakenSquare = {
    ...square,
    takenBy: {
      set: virtualSquareSet,
      isKing: virtualSquareIsKing,
    } as Piece,
  };

  const { rowOffsets, columnOffsets } = calculateMoveOffsets(
    virtualSquareSet,
    square.position
  );

  for (const rowIndex of rowOffsets) {
    for (const columnIndex of columnOffsets) {
      let currentSquare: Square = virtualSquare;
      let currentRowIndex: number = rowIndex;
      let currentColumnIndex: number = columnIndex;

      let capturedSquare: TakenSquare | null = null;
      let enemyFoundCounter = 0;

      while (isWithinCheckerboardBounds(currentRowIndex, currentColumnIndex)) {
        const targetSquare: Square =
          checkerboard[currentRowIndex][currentColumnIndex];

        if (targetSquare.takenBy) {
          if (targetSquare.takenBy.set !== virtualSquareSet) {
            enemyFoundCounter++;

            if (enemyFoundCounter === 1) {
              capturedSquare = targetSquare as TakenSquare;
            }
          } else {
            break;
          }
        } else {
          if (enemyFoundCounter === 1) {
            const move: Move = {
              square: targetSquare,
              capturedSquare,
              isCaptureMove: true,
              isImmediateMove: false,
            };

            possibleMoves.push(move);
          }

          break;
        }

        const { rowIndex: newRowIndex, columnIndex: newColumnIndex } =
          calculateDiagonalOffset(
            currentSquare.position,
            targetSquare.position
          );

        currentSquare = targetSquare;
        currentRowIndex = newRowIndex;
        currentColumnIndex = newColumnIndex;
      }
    }
  }

  return possibleMoves;
}

function getKingPossibleMovesVirtually(
  square: Square,
  checkerboard: Checkerboard,
  {
    virtualSquareSet,
    virtualSquareIsKing,
  }: { virtualSquareSet: Set; virtualSquareIsKing: boolean }
): Move[] {
  const possibleMoves: Move[] = [];

  const virtualSquare: TakenSquare = {
    ...square,
    takenBy: {
      set: virtualSquareSet,
      isKing: virtualSquareIsKing,
    } as Piece,
  };

  const { rowOffsets, columnOffsets } = calculateKingMoveOffsets(
    square.position
  );

  for (const rowIndex of rowOffsets) {
    for (const columnIndex of columnOffsets) {
      let currentSquare: Square = virtualSquare;
      let currentRowIndex: number = rowIndex;
      let currentColumnIndex: number = columnIndex;

      let capturedSquare: TakenSquare | null = null;
      let enemyFoundCounter = 0;

      while (isWithinCheckerboardBounds(currentRowIndex, currentColumnIndex)) {
        const targetSquare: Square =
          checkerboard[currentRowIndex][currentColumnIndex];

        if (targetSquare.takenBy) {
          if (targetSquare.takenBy.set !== virtualSquareSet) {
            enemyFoundCounter++;

            if (enemyFoundCounter === 1) {
              capturedSquare = targetSquare as TakenSquare;
            }
          } else {
            break;
          }
        } else {
          if (enemyFoundCounter === 1) {
            const move: Move = {
              square: targetSquare,
              capturedSquare,
              isCaptureMove: true,
              isImmediateMove: false,
            };

            possibleMoves.push(move);
          }
        }

        if (enemyFoundCounter > 1) {
          break;
        }

        const { rowIndex: newRowIndex, columnIndex: newColumnIndex } =
          calculateDiagonalOffset(
            currentSquare.position,
            targetSquare.position
          );

        currentSquare = targetSquare;
        currentRowIndex = newRowIndex;
        currentColumnIndex = newColumnIndex;
      }
    }
  }

  return possibleMoves;
}

function isWithinCheckerboardBounds(i: number, j: number): boolean {
  return i >= 0 && i < SQUARES_PER_SIDE && j >= 0 && j < SQUARES_PER_SIDE;
}

function isKingCandidate(square: TakenSquare): boolean {
  const { rowIndex } = square.position;
  const isLightSet = square.takenBy.set === Set.Light;

  return (
    (isLightSet && rowIndex === 0) ||
    (!isLightSet && rowIndex === SQUARES_PER_SIDE - 1)
  );
}

function promoteToKing(piece: Piece): Piece {
  return { ...piece, isKing: true };
}

// TODO: Consider other checkers rules
function calculateMoveOffsets(
  turn: Set,
  { rowIndex, columnIndex }: Position
): {
  rowOffsets: [number] | [number, number];
  columnOffsets: [number, number];
} {
  const isLightSet = turn === Set.Light;

  const forwardRow = isLightSet ? rowIndex - 1 : rowIndex + 1;
  const leftColumn = isLightSet ? columnIndex - 1 : columnIndex + 1;
  const rightColumn = isLightSet ? columnIndex + 1 : columnIndex - 1;

  return { rowOffsets: [forwardRow], columnOffsets: [leftColumn, rightColumn] };
}

function calculateKingMoveOffsets({ rowIndex, columnIndex }: Position): {
  rowOffsets: [number, number];
  columnOffsets: [number, number];
} {
  const upRow = rowIndex - 1;
  const downRow = rowIndex + 1;
  const leftColumn = columnIndex - 1;
  const rightColumn = columnIndex + 1;

  return {
    rowOffsets: [upRow, downRow],
    columnOffsets: [leftColumn, rightColumn],
  };
}

function calculateDiagonalOffset(
  startPosition: Position,
  endPosition: Position
): Position {
  const { deltaRow, deltaColumn } = calculateDirection(
    startPosition,
    endPosition
  );

  const oppositeRowIndex = endPosition.rowIndex + deltaRow;
  const oppositeColumnIndex = endPosition.columnIndex + deltaColumn;

  return { rowIndex: oppositeRowIndex, columnIndex: oppositeColumnIndex };
}

function calculateDirection(
  { rowIndex: startRowIndex, columnIndex: startColumnIndex }: Position,
  { rowIndex: endRowIndex, columnIndex: endColumnIndex }: Position
): { deltaRow: number; deltaColumn: number } {
  return {
    deltaRow: endRowIndex - startRowIndex,
    deltaColumn: endColumnIndex - startColumnIndex,
  };
}

function getComingFromSquarePositon(
  currentSquarePosition: Position,
  selectedSquarePosition: Position
): Position {
  const { deltaRow: comingFromDeltaRow, deltaColumn: comingFromDeltaColumn } =
    calculateDirection(currentSquarePosition, selectedSquarePosition);

  const [comingFromRelativeRow, comingFromRelativeColumn] = [
    comingFromDeltaRow / Math.abs(comingFromDeltaRow),
    comingFromDeltaColumn / Math.abs(comingFromDeltaColumn),
  ];

  return {
    rowIndex: currentSquarePosition.rowIndex + comingFromRelativeRow,
    columnIndex: currentSquarePosition.columnIndex + comingFromRelativeColumn,
  };
}
