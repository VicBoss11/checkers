import { useRef, useContext, useState, useEffect } from 'react';
import { CheckersContext } from '../context/checkers-context';
import { isLightSet, getClassName } from '../helpers/checkers-helper';
import { GameMode } from '../models/enums/game-state';
import { CheckersHook } from '../models/interfaces/custom-hooks';

function useCheckers(): CheckersHook {
  const isInitialMount = useRef<boolean>(true);
  const isInitialTurn = useRef<boolean>(true);
  const { gameState } = useContext(CheckersContext);

  const { turn } = gameState;
  const { gameMode, showCheckerboardGuides } = gameState.settings;

  const isLocalGameMode = gameMode === GameMode.Local;
  const isLightTurn = isLightSet(turn);

  const isLocalGameModeClassName = isLocalGameMode
    ? 'checkers--is-local-mode'
    : '';
  const turnClassName = isLightTurn
    ? 'checkers--is-light-turn'
    : 'checkers--is-dark-turn';
  const isInitialTurnClassName = isInitialTurn.current
    ? 'checkers--is-initial-turn'
    : '';

  const [className, setClassName] = useState<string>(
    getClassName([
      'checkers',
      isLocalGameModeClassName,
      turnClassName,
      isInitialTurnClassName,
    ])
  );

  // Effect that, when the turn changes and it is not the
  // first mount, sets a flag indicating it's no longer
  // the initial turn
  useEffect(() => {
    if (!isInitialMount.current) {
      isInitialTurn.current = false;
    }
  }, [turn]);
  // Effect that sets a flag indicating it's no longer the
  // first mount when the component mounts
  useEffect(() => {
    isInitialMount.current = false;
  }, []);
  // Effect that changes the class name with each turn change,
  // except for the initial mount and the initial turn
  useEffect(() => {
    if (!isInitialMount.current && !isInitialTurn.current) {
      setClassName(
        getClassName(['checkers', isLocalGameModeClassName, turnClassName])
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn]);

  return {
    className,
    showCheckerboardGuides,
  };
}

export default useCheckers;
