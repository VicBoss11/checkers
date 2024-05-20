import { createContext, ReactNode } from 'react';
import { DEFAULT_CHECKERS_CONTEXT } from '../helpers/constants/game-context';
import { CheckersContext as IGameContext } from '../models/interfaces/game-context';
import useCheckers from '../hooks/use-checkers';

export const GameContext = createContext<IGameContext>(
  DEFAULT_CHECKERS_CONTEXT
);

export function GameProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const { gameState, setFunctions } = useCheckers();

  return (
    <GameContext.Provider
      value={{
        gameState,
        setFunctions,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
