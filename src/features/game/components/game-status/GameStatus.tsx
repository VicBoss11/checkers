import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { CheckersContext } from '../../context/checkers-context';
import { isLightSet } from '../../helpers/checkers-helper';
import { PieceSet } from '@features/game/models/enums/checkers';
import './GameStatus.scss';

function GameSatus() {
  const { gameState, setFunctions } = useContext(CheckersContext);

  const {
    player1,
    player2,
    checkerboard,
    activeSquare,
    lightsRemaining,
    darksRemaining,
    lightKingsCount,
    darkKingsCount,
  } = gameState;

  const {
    setLightsRemaining,
    setDarksRemaining,
    setLightKingsCount,
    setDarkKingsCount,
  } = setFunctions;

  const playerOneSetClassName = isLightSet(player1.set)
    ? 'piece-light'
    : 'piece-dark';
  const playerTwoSetClassName = isLightSet(player2.set)
    ? 'piece-light'
    : 'piece-dark';

  const [timer, setTimer] = useState<number>(0);

  const updatePiecesRemaining = useCallback(
    (
      pieceSet: PieceSet,
      setPiecesRemainig: Dispatch<SetStateAction<number>>
    ): void => {
      const piecesRemaining = checkerboard
        .flat()
        .filter(
          (square) => square.takenBy && square.takenBy.set === pieceSet
        ).length;

      setPiecesRemainig(piecesRemaining);
    },
    [checkerboard]
  );

  const updateKingsCount = useCallback(
    (
      pieceSet: PieceSet,
      setKingsCount: Dispatch<SetStateAction<number>>
    ): void => {
      const kingsCount = checkerboard
        .flat()
        .filter(
          (square) => square.takenBy?.isKing && square.takenBy.set === pieceSet
        ).length;

      setKingsCount(kingsCount);
    },
    [checkerboard]
  );

  useEffect(() => {
    updatePiecesRemaining(PieceSet.Light, setLightsRemaining);
    updatePiecesRemaining(PieceSet.Dark, setDarksRemaining);

    updateKingsCount(PieceSet.Light, setLightKingsCount);
    updateKingsCount(PieceSet.Dark, setDarkKingsCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkerboard]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeElapsed = new Date(timer * 1000).toISOString().slice(11, 19);

  return (
    <section className="game-status">
      <header className="game-status-title">Estado actual</header>

      <article className="game-status-info">
        <section className="game-status-item game-status-time-elapsed">
          <span className="game-status-label">Tiempo: </span>
          <span className="game-status-value">{timeElapsed}</span>
        </section>

        <section
          className={`game-status-item game-status-player ${playerOneSetClassName}`}
        >
          <span className="game-status-label">Jugador 1:</span>
          <span className="game-status-value">{player1.name}</span>
        </section>

        <section
          className={`game-status-item game-status-player ${playerTwoSetClassName}`}
        >
          <span className="game-status-label">Jugador 2:</span>
          <span className="game-status-value">{player2.name}</span>
        </section>

        <section className="game-status-item game-status-active-piece">
          <span className="game-status-label">Pieza activa:</span>

          <span className="game-status-value">
            {activeSquare !== null ? activeSquare.location : 'ninguna'}
          </span>
        </section>

        <section className="game-status-item-multiple game-status-lights-info">
          <header className="game-status-label">Información de blancas:</header>

          <article className="game-status-value-multiple">
            <div className="game-status-subitem game-status-pieces-remaining">
              <span className="game-status-label">Piezas restantes:</span>
              <span className="game-status-value">{lightsRemaining}</span>
            </div>

            <div className="game-status-item game-status-kings">
              <span className="game-status-label">Damas:</span>
              <span className="game-status-value">{lightKingsCount}</span>
            </div>
          </article>
        </section>

        <section className="game-status-item-multiple game-status-darks-info">
          <header className="game-status-label">Información de negras:</header>

          <article className="game-status-value-multiple">
            <div className="game-status-subitem game-status-pieces-remaining">
              <span className="game-status-label">Piezas restantes:</span>
              <span className="game-status-value">{darksRemaining}</span>
            </div>

            <div className="game-status-item game-status-kings">
              <span className="game-status-label">Damas:</span>
              <span className="game-status-value">{darkKingsCount}</span>
            </div>
          </article>
        </section>
      </article>
    </section>
  );
}

export default GameSatus;
