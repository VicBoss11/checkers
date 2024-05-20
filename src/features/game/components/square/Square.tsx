import { MouseEvent, ReactElement } from 'react';
import { Square as ISquare } from '../../models/interfaces/checkers';
import usePlayableSquare from '../../hooks/use-playable-square';
import Piece from '../piece/Piece';
import './Square.scss';

function Square({ square }: { square: ISquare }): ReactElement {
  return square.isPlayable ? (
    <PlayableSquare square={square} />
  ) : (
    <NonPlayableSquare square={square} />
  );
}

function PlayableSquare({ square }: { square: ISquare }): ReactElement {
  const {
    className,
    squareStates,
    makeMove,
    highlightPaths,
    updateUiCheckerboard,
  } = usePlayableSquare(square);

  const { isActive, isPossibleMove, isImmediateMove, isClickable } =
    squareStates;

  const handleSquareClick = (e: MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();

    // If it's the current active square, do nothing
    if (isActive) {
      return;
    }
    // If it's not the current active square, but it's an immediate move,
    // move the piece
    if (isImmediateMove) {
      makeMove();

      return;
    }
    // If it's not the current active square and it's a possible move,
    // but not immediate, highlight the paths
    if (!isImmediateMove && isPossibleMove) {
      highlightPaths();

      return;
    }

    // If the above conditions are not met, update the UI checkerboard
    updateUiCheckerboard();
  };

  return (
    <div
      className={className}
      onClick={isClickable ? handleSquareClick : undefined}
    >
      {square.takenBy && <Piece piece={square.takenBy} />}
    </div>
  );
}

function NonPlayableSquare({ square }: { square: ISquare }): ReactElement {
  const className = `square square-${square.color}`;

  return <div className={className}></div>;
}

export default Square;
