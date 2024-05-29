import { ReactElement, useContext, useEffect } from 'react';
import { SQUARES_PER_SIDE } from '../../constants/checkers';
import { CheckersContext } from '../../context/checkers-context';
import { Square as ISquare } from '../../models/interfaces/checkers';
import Square from '../square/Square';
import './Checkerboard.scss';

function Checkerboard(): ReactElement {
  const { gameState, setFunctions } = useContext(CheckersContext);

  const { checkerboard, uiCheckerboard, turn, isCaptureTurn, activeSquare } =
    gameState;
  const { setUiCheckerboard, setActiveSquare, setCurrentPaths } = setFunctions;

  const squares: ISquare[] = [];

  for (let i = 0; i < SQUARES_PER_SIDE; i++) {
    for (let j = 0; j < SQUARES_PER_SIDE; j++) {
      squares.push(uiCheckerboard[i][j]);
    }
  }

  useEffect(() => {
    setCurrentPaths([]);
  }, [turn, setCurrentPaths]);

  const handleOutsideClick = (): void => {
    if (isCaptureTurn) {
      return;
    }

    if (activeSquare) {
      setUiCheckerboard(checkerboard);
      setActiveSquare(null);
      setCurrentPaths([]);
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

export default Checkerboard;
