import { useRef, useContext, useMemo, useEffect, useCallback } from 'react';
import { CheckersContext } from '../context/checkers-context';
import {
  getClassName,
  getPathsWithoutLastMove,
  getPathsStartingWithSquare,
  getUpdatedUiCheckerboard,
} from '../helpers/checkers-helper';
import {
  getImmediatePaths,
  checkForCaptureMove,
  move,
  getNonImmediatePaths,
} from '../logic/checkers';
import { PieceSet } from '../models/enums/checkers';
import { Square, TakenSquare, Position } from '../models/interfaces/checkers';
import { PlayableSquareHook } from '../models/interfaces/custom-hooks';
import { MovePath, Checkerboard } from '../models/types/checkers';

function usePlayableSquare(square: Square): PlayableSquareHook {
  const squareRef = useRef<HTMLDivElement>(null);

  const { gameState, setFunctions } = useContext(CheckersContext);

  const {
    checkerboard,
    turn,
    isCaptureTurn,
    selectedSquare,
    activeSquare,
    currentPaths,
  } = gameState;

  const {
    setCheckerboard,
    setUiCheckerboard,
    setTurn,
    setIsCaptureTurn,
    setSelectedSquare,
    setActiveSquare,
    setCurrentPaths,
  } = setFunctions;

  const isSelected = selectedSquare?.id === square.id;
  const isActive = activeSquare?.id === square.id;
  const isTaken = square.takenBy !== null;
  const isCurrentTurn = isTaken && square.takenBy!.set === turn;
  const isPossibleMove = square.isPossibleMove;
  const isImmediateMove = square.isImmediateMove;

  const immediatePaths: MovePath[] = useMemo(() => {
    if (isCaptureTurn) {
      return currentPaths;
    }

    return isCurrentTurn
      ? getImmediatePaths(square as TakenSquare, checkerboard, gameState)
      : [];
  }, [
    isCaptureTurn,
    isCurrentTurn,
    square,
    checkerboard,
    gameState,
    currentPaths,
  ]);

  const isMovable = useMemo(() => {
    const isMovable =
      isTaken && turn === square.takenBy!.set && immediatePaths.length > 0;

    return isCaptureTurn ? isSelected && isMovable : isMovable;
  }, [
    square.takenBy,
    immediatePaths,
    turn,
    isCaptureTurn,
    isSelected,
    isTaken,
  ]);

  const isClickable = isMovable || isPossibleMove;

  const className = useMemo(() => {
    const colorClassName = `square-${square.color}`;
    const isMovableClassName = isMovable ? 'square--is-movable' : '';
    const isActiveClassName = isActive ? 'square--is-active' : '';
    const isPossibleMoveClassName = isPossibleMove
      ? 'square--is-possible-move'
      : '';
    const isImmediateMoveClassName = isImmediateMove
      ? 'square--is-immediate-move'
      : '';
    return getClassName([
      'square',
      colorClassName,
      isMovableClassName,
      isActiveClassName,
      isPossibleMoveClassName,
      isImmediateMoveClassName,
    ]);
  }, [square.color, isMovable, isActive, isPossibleMove, isImmediateMove]);

  useEffect(() => {
    if (isCaptureTurn && isMovable && !isActive) {
      squareRef.current!.click();
    }
  }, [isActive, isCaptureTurn, isMovable]);

  const finalizeTurn = useCallback(() => {
    setSelectedSquare(null);
    setTurn((prevTurn) =>
      prevTurn === PieceSet.Light ? PieceSet.Dark : PieceSet.Light
    );
    setIsCaptureTurn(false);
  }, [setSelectedSquare, setTurn, setIsCaptureTurn]);

  const continueTurn = useCallback(
    (
      { rowIndex: targetRowIndex, columnIndex: targetColumnIndex }: Position,
      paths: MovePath[],
      checkerboard: Checkerboard
    ) => {
      const newPaths = getPathsWithoutLastMove(paths);

      setCurrentPaths(newPaths);
      setSelectedSquare(checkerboard[targetRowIndex][targetColumnIndex]);
      setTurn((prevTurn) => prevTurn);
      setIsCaptureTurn(true);
    },
    [setSelectedSquare, setCurrentPaths, setTurn, setIsCaptureTurn]
  );

  const handleCaptureMove = useCallback(
    (
      targetSquare: Square,
      currentPaths: MovePath[],
      checkerboard: Checkerboard
    ): void => {
      const possiblePaths = getPathsStartingWithSquare(
        targetSquare,
        currentPaths
      );

      const isLastMove = possiblePaths.every((path) => path.length === 1);

      if (isLastMove) {
        finalizeTurn();
      } else {
        continueTurn(targetSquare.position, possiblePaths, checkerboard);
      }
    },
    [finalizeTurn, continueTurn]
  );

  const makeMove = () => {
    const fromSquare: TakenSquare = activeSquare!;
    const toSquare: Square = square;

    const isCaptureMove = checkForCaptureMove(toSquare, currentPaths);

    const newCheckerboard = move(
      fromSquare,
      toSquare,
      checkerboard,
      currentPaths,
      isCaptureMove
    );

    if (isCaptureMove) {
      handleCaptureMove(toSquare, currentPaths, newCheckerboard);
    } else {
      finalizeTurn();
    }

    setActiveSquare(null);
    setCheckerboard(newCheckerboard);
    setUiCheckerboard(newCheckerboard);
  };

  // TODO: Implement the logic for highlighting paths
  const highlightPaths = () => {
    return;
  };

  const updateUiCheckerboard = () => {
    setActiveSquare(square as TakenSquare);

    setUiCheckerboard(() => {
      const paths = [
        ...immediatePaths,
        ...getNonImmediatePaths(
          square as TakenSquare,
          checkerboard,
          gameState,
          immediatePaths
        ),
      ];

      setCurrentPaths(paths);

      return getUpdatedUiCheckerboard(checkerboard, paths);
    });
  };

  return {
    className,
    squareStates: {
      isActive,
      isPossibleMove,
      isImmediateMove,
      isClickable,
    },
    squareRef,
    makeMove,
    highlightPaths,
    updateUiCheckerboard,
  };
}

export default usePlayableSquare;
