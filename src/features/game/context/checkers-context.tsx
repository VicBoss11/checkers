import { createContext, ReactNode } from 'react';
import { DEFAULT_CHECKERS_CONTEXT } from '../constants/checkers-context-default';
import useDefaultCheckers from '../hooks/use-default-checkers';
import { CheckersContext as ICheckersContext } from '../models/interfaces/checkers-context';

export const CheckersContext = createContext<ICheckersContext>(
  DEFAULT_CHECKERS_CONTEXT
);

export function CheckersProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const { gameState, setFunctions } = useDefaultCheckers();

  return (
    <CheckersContext.Provider
      value={{
        gameState,
        setFunctions,
      }}
    >
      {children}
    </CheckersContext.Provider>
  );
}
