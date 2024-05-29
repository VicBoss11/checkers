import { useContext, useEffect } from 'react';
import { CheckersContext } from '../../context/checkers-context';
import { isLightSet } from '../../helpers/checkers-helper';
import './TurnInfo.scss';

function TurnInfo() {
  const { gameState, setFunctions } = useContext(CheckersContext);

  const { player1, player2, turn } = gameState;
  const { setPlayer1, setPlayer2 } = setFunctions;

  const isPlayerOneTurn = turn === player1.set;
  const isLightTurn = isLightSet(turn);

  const player = isPlayerOneTurn ? player1 : player2;
  const setPlayer = isPlayerOneTurn ? setPlayer1 : setPlayer2;
  const displayPlayerSet = isLightTurn ? 'Blancas' : 'Negras';

  const pieceSetClassName = isLightTurn
    ? 'piece-set--is-light'
    : 'piece-set--is-dark';

  useEffect(() => {
    if (player.timeRemaining > 0) {
      const interval = setInterval(() => {
        setPlayer((prev) => {
          if (prev.timeRemaining > 0) {
            return {
              ...prev,
              timeRemaining: prev.timeRemaining - 1,
            };
          } else {
            clearInterval(interval);

            return prev;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [player.timeRemaining, setPlayer]);

  const timeRemaining = new Date(player.timeRemaining * 1000)
    .toISOString()
    .slice(14, 19);

  return (
    <aside className="turn-info">
      <span className="turn-info-player">{player.name}</span>
      <span className="turn-info-time">{timeRemaining}</span>
      <span className={`turn-info-piece-set ${pieceSetClassName}`}>
        {displayPlayerSet}
      </span>
    </aside>
  );
}

export default TurnInfo;
