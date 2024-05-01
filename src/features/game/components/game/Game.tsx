import { ReactElement } from 'react';
import { buildDefaultCheckerboard } from '../../helpers/checkerboard.helper';
import { SQUARES_PER_SIDE } from '../../helpers/constants';
import { Piece as IPiece, Square as ISquare } from '../../models/interfaces';
import './Game.scss';

function Game(): ReactElement {
  return <Checkerboard />;
}

function Checkerboard(): ReactElement {
  const defaultCheckerboard = buildDefaultCheckerboard();
  const squares: ISquare[] = [];

  for (let i = 0; i < SQUARES_PER_SIDE; i++) {
    for (let j = 0; j < SQUARES_PER_SIDE; j++) {
      squares.push(defaultCheckerboard[i][j]);
    }
  }

  return (
    <div className="checkerboard">
      {squares.map(
        (square: ISquare): ReactElement => (
          <Square key={square.id} square={square} />
        )
      )}
    </div>
  );
}

function Square({ square }: { square: ISquare }): ReactElement {
  const className = `square square-${square.color}`;

  return (
    <div className={className}>
      {square.takenBy && (
        <Piece key={square.takenBy.id} piece={square.takenBy} />
      )}
    </div>
  );
}

function Piece({ piece }: { piece: IPiece }): ReactElement {
  const className = `piece piece-${piece.set}`;

  return <span className={className} />;
}

export default Game;
