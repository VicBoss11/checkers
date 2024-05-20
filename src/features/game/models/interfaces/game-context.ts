import { Dispatch, SetStateAction } from 'react';
import { Checkerboard, MovePath } from '../types';
import { Square, TakenSquare } from '.';
import { Set } from '../enums';
import { Settings, RuleSet } from './game-settings';
import { GameState, Player } from './game-state';

export interface CheckersContext {
  gameState: GameState;
  setFunctions: {
    setSettings: Dispatch<SetStateAction<Settings>>;
    setRules: Dispatch<SetStateAction<RuleSet>>;
    setPlayer1: Dispatch<SetStateAction<Player>>;
    setPlayer2: Dispatch<SetStateAction<Player>>;
    setCheckerboard: Dispatch<SetStateAction<Checkerboard>>;
    setUiCheckerboard: Dispatch<SetStateAction<Checkerboard>>;
    setTurn: Dispatch<SetStateAction<Set>>;
    setIsCaptureTurn: Dispatch<SetStateAction<boolean>>;
    setWinner: Dispatch<SetStateAction<Set | null>>;
    setSelectedSquare: Dispatch<SetStateAction<Square | null>>;
    setActiveSquare: Dispatch<SetStateAction<TakenSquare | null>>;
    setCurrentPaths: Dispatch<SetStateAction<MovePath[]>>;
    setRemainingLights: Dispatch<SetStateAction<number>>;
    setRemainingDarks: Dispatch<SetStateAction<number>>;
  };
}
