import { MouseEvent, ReactElement, useContext, useEffect } from 'react';
import { Piece as IPiece, Square as ISquare } from '../../models/interfaces';
import { GameContext, GameProvider } from '../../context/game-context';
import { Set } from '../../models/enums';
import { getClassName } from '../../helpers/checkers.helper';
import { SQUARES_PER_SIDE } from '../../helpers/constants/checkers';
import usePlayableSquare from '../../hooks/use-playable-square';
import './Game.scss';

function Game(): ReactElement {
  return (
    <GameProvider>
      <Checkerboard />
    </GameProvider>
  );
}

function Checkerboard(): ReactElement {
  const { gameState, setFunctions } = useContext(GameContext);

  const { checkerboard, uiCheckerboard, activeSquare } = gameState;
  const { setUiCheckerboard, setActiveSquare } = setFunctions;

  useEffect(() => {
    console.log('Cambió el estado del tablero');
  }, [checkerboard]);

  const squares: ISquare[] = [];

  for (let i = 0; i < SQUARES_PER_SIDE; i++) {
    for (let j = 0; j < SQUARES_PER_SIDE; j++) {
      squares.push(uiCheckerboard[i][j]);
    }
  }

  const handleOutsideClick = (): void => {
    if (activeSquare) {
      setUiCheckerboard(checkerboard);
      setActiveSquare(null);
    }
  };

  return (
    <div
      className="checkerboard"
      onClick={activeSquare ? handleOutsideClick : undefined}
    >
      {squares.map(
        (square: ISquare): ReactElement => (
          <Square key={square.id} square={square} />
        )
      )}
    </div>
  );
}

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

function Piece({ piece }: { piece: IPiece }): ReactElement {
  const color = piece.set === Set.Light ? 'light' : 'dark';

  const colorClassName = `piece-${color}`;
  const isKingClassName = piece.isKing ? 'piece--is-king' : '';

  const className = getClassName(['piece', colorClassName, isKingClassName]);

  return <span className={className} />;
}

export default Game;
