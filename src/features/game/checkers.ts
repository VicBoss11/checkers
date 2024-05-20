import {
  cloneCheckerboard,
  isDarkSet,
  isLightSet,
  isOnFirstRow,
  isOnLastRow,
} from './helpers/checkers.helper';
import { SQUARES_PER_SIDE } from './helpers/constants/checkers';
import { PieceType, Set } from './models/enums';
import {
  Piece,
  Position,
  TakenSquare,
  Move,
  Square,
} from './models/interfaces';
import { GameState } from './models/interfaces/game-state';
import { Checkerboard, MovePath } from './models/types';

export function move(
  fromSquare: TakenSquare,
  toSquare: Square,
  checkerboard: Checkerboard,
  immediatePaths: MovePath[],
  isCaptureMove: boolean
): Checkerboard {
  const newCheckerboard = cloneCheckerboard(checkerboard);

  if (isCaptureMove) {
    const capturedSquare = getImmediateMove(
      toSquare,
      immediatePaths
    ).capturedSquare!;

    const { rowIndex: capturedRowIndex, columnIndex: capturedColumnIndex } =
      capturedSquare.position;

    newCheckerboard[capturedRowIndex][capturedColumnIndex].takenBy = null;
  }

  const { rowIndex: fromRowIndex, columnIndex: fromColumnIndex } =
    fromSquare.position;
  const { rowIndex: toRowIndex, columnIndex: toColumnIndex } =
    toSquare.position;

  // Now targetSquare is taken by the piece that was in fromSquare
  const targetSquare: TakenSquare = {
    ...newCheckerboard[toRowIndex][toColumnIndex],
    takenBy: {
      ...fromSquare.takenBy,
      position: toSquare.position,
      location: toSquare.location,
    },
  };

  newCheckerboard[toRowIndex][toColumnIndex] = targetSquare;
  newCheckerboard[fromRowIndex][fromColumnIndex].takenBy = null;

  if (checkIsKingCandidate(targetSquare)) {
    promoteToKing(targetSquare);
  }

  return newCheckerboard;
}

export function getImmediatePaths(
  square: TakenSquare,
  checkerboard: Checkerboard,
  gameState: GameState
): MovePath[] {
  const immediatePaths: MovePath[] = [];

  const { type: pieceType } = square.takenBy;

  const { rowOffsets, columnOffsets } = selectCalculateMoveOffsetsFunction(
    pieceType
  )(square.position, gameState);

  for (const rowIndex of rowOffsets) {
    for (const columnIndex of columnOffsets) {
      const moves: Move[] = selectGetMovesFunction(pieceType)(
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

export function getNonImmediatePaths(
  square: TakenSquare,
  checkerboard: Checkerboard,
  gameState: GameState,
  immediatePaths?: MovePath[]
): MovePath[] {
  const paths =
    immediatePaths ?? getImmediatePaths(square, checkerboard, gameState);

  if (paths.length === 0) {
    return [];
  }

  const capturePaths: MovePath[] = getCapturePaths(paths);

  if (capturePaths.length === 0) {
    return [];
  }

  return getChainedPaths(square, checkerboard, gameState, capturePaths);
}

export function checkForCaptureMove(
  square: Square,
  paths: MovePath[]
): boolean {
  return paths.some((path) =>
    path
      .filter((move) => move.square.id === square.id)
      .some((move) => move.isCaptureMove)
  );
}

function getImmediateMove(square: Square, immediatePaths: MovePath[]): Move {
  return immediatePaths.flat().find((move) => move.square.id === square.id)!;
}

function selectGetMovesFunction(
  pieceType: PieceType
): (
  square: TakenSquare,
  position: Position,
  checkerboard: Checkerboard,
  areImmediateMoves?: boolean
) => Move[] {
  const getMovesFunctions = [getNonKingMoves, getKingMoves];

  return getMovesFunctions[pieceType];
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
  gameState: GameState,
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
        type: square.takenBy.type,
        isKing: square.takenBy.isKing,
      } as Piece,
    };

    const newMoves: Move[] = getMovesVirtually(
      virtualSquare,
      virtualCheckerboard,
      gameState
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

  return getChainedPaths(square, checkerboard, gameState, chainedPaths, paths);
}

function getMovesVirtually(
  virtualSquare: TakenSquare,
  virtualCheckerboard: Checkerboard,
  gameState: GameState
): Move[] {
  const moves: Move[] = [];

  const { type: pieceType } = virtualSquare.takenBy;

  const { rowOffsets, columnOffsets } = selectCalculateMoveOffsetsFunction(
    pieceType
  )(virtualSquare.position, gameState);

  for (const rowIndex of rowOffsets) {
    for (const columnIndex of columnOffsets) {
      const newMoves: Move[] = selectGetMovesFunction(pieceType)(
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

export function checkIsKingCandidate(square: TakenSquare): boolean {
  const { rowIndex } = square.position;
  const { isKing, set } = square.takenBy;

  if (isKing) {
    return false;
  }

  if (checkIsOppositeRow(set, rowIndex)) {
    return true;
  }

  return false;
}

export function checkIsOppositeRow(pieceSet: Set, rowIndex: number): boolean {
  return (
    (isLightSet(pieceSet) && isOnFirstRow(rowIndex)) ||
    (isDarkSet(pieceSet) && isOnLastRow(rowIndex))
  );
}

function promoteToKing(square: TakenSquare): void {
  square.takenBy.type = PieceType.King;
  square.takenBy.isKing = true;
}

function isWithinCheckerboardBounds(i: number, j: number): boolean {
  return i >= 0 && i < SQUARES_PER_SIDE && j >= 0 && j < SQUARES_PER_SIDE;
}

// TODO: Put this in a separate file
interface Offsets {
  rowOffsets: number[];
  columnOffsets: number[];
}

function selectCalculateMoveOffsetsFunction(
  pieceType: PieceType
): (position: Position, gameState: GameState) => Offsets {
  const calculateMoveOffsetsFunctions = [
    calculateNonKingMoveOffsets,
    calculateKingMoveOffsets,
  ];

  return calculateMoveOffsetsFunctions[pieceType];
}

// TODO: Consider other checkers rules
function calculateNonKingMoveOffsets(
  { rowIndex, columnIndex }: Position,
  gameState: GameState
): Offsets {
  const { turn } = gameState;

  const isLightSet = turn === Set.Light;

  const forwardRow = isLightSet ? rowIndex - 1 : rowIndex + 1;
  const leftColumn = isLightSet ? columnIndex - 1 : columnIndex + 1;
  const rightColumn = isLightSet ? columnIndex + 1 : columnIndex - 1;

  return { rowOffsets: [forwardRow], columnOffsets: [leftColumn, rightColumn] };
}

function calculateKingMoveOffsets(
  { rowIndex, columnIndex }: Position,
  gameState: GameState
): Offsets {
  const { turn } = gameState;

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
