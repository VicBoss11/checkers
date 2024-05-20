import { Set } from '../models/enums';
import { Square } from '../models/interfaces';
import { Checkerboard, MovePath } from '../models/types';
import { FIRST_ROW_INDEX, LAST_ROW_INDEX } from './constants/checkers';

export function cloneCheckerboard(checkerboard: Checkerboard): Checkerboard {
  return checkerboard.map((row) => row.map((square) => ({ ...square })));
}

export function getUpdatedUiCheckerboard(
  uiCheckerboard: Checkerboard,
  paths: MovePath[]
): Checkerboard {
  const newUiCheckerboard = cloneCheckerboard(uiCheckerboard);

  for (const path of paths) {
    for (const move of path) {
      const { rowIndex, columnIndex } = move.square.position;
      const targetSquare = newUiCheckerboard[rowIndex][columnIndex];

      targetSquare.isPossibleMove = true;
      targetSquare.isImmediateMove = targetSquare.isImmediateMove
        ? true
        : move.isImmediateMove;
    }
  }

  return newUiCheckerboard;
}

export function getClassName(classes: string[]): string {
  return classes.filter((className) => className !== '').join(' ');
}

export function getPathsStartingWithSquare(
  startSquare: Square,
  paths: MovePath[]
): MovePath[] {
  return paths.filter((path) => path[0].square.id === startSquare.id);
}

export function getPathsWithoutLastMove(paths: MovePath[]): MovePath[] {
  return paths
    .map((path) => path.slice(1))
    .filter((path) => path.length > 0)
    .map((path) => {
      path[0].isImmediateMove = true;

      return path;
    });
}

export function isLightSet(set: Set): boolean {
  return set === Set.Light;
}

export function isDarkSet(set: Set): boolean {
  return set === Set.Dark;
}

export function isOnFirstRow(rowIndex: number): boolean {
  return rowIndex === FIRST_ROW_INDEX;
}
export function isOnLastRow(rowIndex: number): boolean {
  return rowIndex === LAST_ROW_INDEX;
}
