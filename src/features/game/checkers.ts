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

export function getMovePaths(
  square: TakenSquare,
  checkerboard: Checkerboard,
  turn: Set
): MovePath[] {
  const possiblePaths: MovePath[] = [];

  if (square.takenBy.set !== turn) {
    return possiblePaths;
  }

  const immediatePaths: MovePath[] = getImmediatePaths(square, checkerboard);
  // TODO: Consider rule for accessibility
  const nonImmediatePaths: MovePath[] = getNonImmediatePaths(
    square,
    checkerboard,
    immediatePaths
  );

  const paths: MovePath[] = [...immediatePaths, ...nonImmediatePaths];

  return paths;
}

function getImmediatePaths(
  square: TakenSquare,
  checkerboard: Checkerboard
): MovePath[] {
  const immediatePaths: MovePath[] = [];

  const set = square.takenBy.set;
  const isKing = square.takenBy.isKing;
  const pieceTypeKey: 0 | 1 = isKing ? 1 : 0;

  const { rowOffsets, columnOffsets } = selectCalculateMoveOffsetsFunction(
    pieceTypeKey
  )(square.position, set);

  for (const rowIndex of rowOffsets) {
    for (const columnIndex of columnOffsets) {
      const moves: Move[] = selectGetMovesFunction(pieceTypeKey)(
        square,
        { rowIndex, columnIndex },
        checkerboard
      );

      for (const move of moves) {
        immediatePaths.push([move]);
      }
    }
  }

  return immediatePaths;
}

function getNonImmediatePaths(
  square: TakenSquare,
  checkerboard: Checkerboard,
  immediatePaths?: MovePath[]
): MovePath[] {
  const paths = immediatePaths ?? getImmediatePaths(square, checkerboard);

  if (paths.length === 0) {
    return paths;
  }

  const capturePaths: MovePath[] = getCapturePaths(paths);

  if (capturePaths.length === 0) {
    return paths;
  }

  const chainedPaths: MovePath[] = getChainedPaths(
    square,
    checkerboard,
    capturePaths
  );

  return chainedPaths;
}

function selectGetMovesFunction(pieceTypeKey: 0 | 1 = 0) {
  const movesFunctions = [getNonKingMoves, getKingMoves];

  return movesFunctions[pieceTypeKey];
}

function getNonKingMoves(
  square: TakenSquare,
  { rowIndex: toRowIndex, columnIndex: toColumnIndex }: Position,
  checkerboard: Checkerboard,
  areImmediateMoves = true
): Move[] {
  const moves: Move[] = [];

  const initialSquare: TakenSquare = square;
  const initialSet = square.takenBy.set;

  let currentSquare: Square = initialSquare;
  let currentToRowIndex: number = toRowIndex;
  let currentToColumnIndex: number = toColumnIndex;

  let capturedSquare: TakenSquare | null = null;
  let isCaptureMove = false;
  let enemyFoundCounter = 0;

  while (isWithinCheckerboardBounds(currentToRowIndex, currentToColumnIndex)) {
    const targetSquare: Square =
      checkerboard[currentToRowIndex][currentToColumnIndex];

    if (targetSquare.takenBy) {
      if (targetSquare.takenBy.set !== initialSet) {
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
        isImmediateMove: areImmediateMoves,
      };

      if (areImmediateMoves) {
        moves.push(move);
      } else if (enemyFoundCounter === 1) {
        moves.push(move);
      }

      break;
    }

    if (enemyFoundCounter > 1) {
      break;
    }

    const { rowIndex: newToRowIndex, columnIndex: newToColumnIndex } =
      calculateDiagonalOffset(currentSquare.position, targetSquare.position);

    currentSquare = targetSquare;
    currentToRowIndex = newToRowIndex;
    currentToColumnIndex = newToColumnIndex;
  }

  return moves;
}

function getKingMoves(
  square: TakenSquare,
  { rowIndex: toRowIndex, columnIndex: toColumnIndex }: Position,
  checkerboard: Checkerboard,
  areImmediateMoves = true
): Move[] {
  const moves: Move[] = [];

  const initialSquare: TakenSquare = square;
  const initialSet = square.takenBy.set;

  let currentSquare: Square = initialSquare;
  let currentToRowIndex: number = toRowIndex;
  let currentToColumnIndex: number = toColumnIndex;

  let capturedSquare: TakenSquare | null = null;
  let isCaptureMove = false;
  let enemyFoundCounter = 0;

  while (isWithinCheckerboardBounds(currentToRowIndex, currentToColumnIndex)) {
    const targetSquare: Square =
      checkerboard[currentToRowIndex][currentToColumnIndex];

    if (targetSquare.takenBy) {
      if (targetSquare.takenBy.set !== initialSet) {
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
        isImmediateMove: areImmediateMoves,
      };

      if (areImmediateMoves) {
        moves.push(move);
      } else if (enemyFoundCounter === 1) {
        moves.push(move);
      }
    }

    if (enemyFoundCounter > 1) {
      break;
    }

    const { rowIndex: newToRowIndex, columnIndex: newToColumnIndex } =
      calculateDiagonalOffset(currentSquare.position, targetSquare.position);

    currentSquare = targetSquare;
    currentToRowIndex = newToRowIndex;
    currentToColumnIndex = newToColumnIndex;
  }

  return moves;
}

function getCapturePaths(paths: MovePath[]): MovePath[] {
  return paths.filter((path) => path.some((move) => move.isCaptureMove));
}

function getChainedPaths(
  square: TakenSquare,
  checkerboard: Checkerboard,
  capturePaths: MovePath[],
  paths: MovePath[] = []
): MovePath[] {
  const chainedPaths: MovePath[] = [];

  if (capturePaths.length === 0) {
    return paths;
  }

  for (const capturePath of capturePaths) {
    const lastCaptureMove: Move = capturePath[capturePath.length - 1];
    // Create a virtual checkerboard to simulate captures
    const virtualCheckerboard = cloneCheckerboard(checkerboard);

    // Remove captured pieces from the virtual checkerboard
    for (const captureMove of capturePath) {
      const { rowIndex, columnIndex } = captureMove.capturedSquare!.position;

      virtualCheckerboard[rowIndex][columnIndex].takenBy = null;
    }

    // We need to consider the virtual square as if it were taken by a piece
    const virtualSquare: TakenSquare = {
      ...lastCaptureMove.square,
      takenBy: {
        set: square.takenBy.set,
        isKing: square.takenBy.isKing,
      } as Piece,
    };

    const newMoves: Move[] = getMovesVirtually(
      virtualSquare,
      virtualCheckerboard
    );

    // Since the last element of the path doesn't add any new moves,
    // the path is added to the possible move paths
    if (newMoves.length === 0) {
      paths.push(capturePath);
    }

    for (const newMove of newMoves) {
      const newPath: MovePath = [...capturePath];

      newPath.push(newMove);

      chainedPaths.push(newPath);
    }
  }

  return getChainedPaths(square, checkerboard, chainedPaths, paths);
}

function getMovesVirtually(
  virtualSquare: TakenSquare,
  virtualCheckerboard: Checkerboard
): Move[] {
  const moves: Move[] = [];

  const pieceTypeKey: 0 | 1 = virtualSquare.takenBy.isKing ? 1 : 0;

  const { rowOffsets, columnOffsets } = selectCalculateMoveOffsetsFunction(
    pieceTypeKey
  )(virtualSquare.position, virtualSquare.takenBy.set);

  for (const rowIndex of rowOffsets) {
    for (const columnIndex of columnOffsets) {
      const newMoves: Move[] = selectGetMovesFunction(pieceTypeKey)(
        virtualSquare,
        { rowIndex, columnIndex },
        virtualCheckerboard,
        false
      );

      if (newMoves.length > 0) {
        moves.push(...newMoves);
      }
    }
  }

  return moves;
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

function isWithinCheckerboardBounds(i: number, j: number): boolean {
  return i >= 0 && i < SQUARES_PER_SIDE && j >= 0 && j < SQUARES_PER_SIDE;
}

interface Offsets {
  rowOffsets: number[];
  columnOffsets: number[];
}

function selectCalculateMoveOffsetsFunction(pieceTypeKey: 0 | 1 = 0) {
  const calculateMoveOffsetsFunctions = [
    calculateNonKingMoveOffsets,
    calculateKingMoveOffsets,
  ];

  return calculateMoveOffsetsFunctions[pieceTypeKey];
}

// TODO: Consider other checkers rules
function calculateNonKingMoveOffsets(
  { rowIndex, columnIndex }: Position,
  turn: Set
): Offsets {
  const isLightSet = turn === Set.Light;

  const forwardRow = isLightSet ? rowIndex - 1 : rowIndex + 1;
  const leftColumn = isLightSet ? columnIndex - 1 : columnIndex + 1;
  const rightColumn = isLightSet ? columnIndex + 1 : columnIndex - 1;

  return { rowOffsets: [forwardRow], columnOffsets: [leftColumn, rightColumn] };
}

function calculateKingMoveOffsets(
  { rowIndex, columnIndex }: Position,
  turn: Set
): Offsets {
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
