import { Dispatch, SetStateAction } from 'react';
import { PieceSet } from '../enums/checkers';
import { Checkerboard, MovePath } from '../types/checkers';
import { Settings, RuleSet } from './checkers-settings';
import { MoveHistoryItem, Player, Square, TakenSquare } from './checkers';
import { GameState } from './game-state';

export interface CheckersContext {
  gameState: GameState;
  setFunctions: {
    setSettings: Dispatch<SetStateAction<Settings>>;
    setRules: Dispatch<SetStateAction<RuleSet>>;
    setPlayer1: Dispatch<SetStateAction<Player>>;
    setPlayer2: Dispatch<SetStateAction<Player>>;
    setCheckerboard: Dispatch<SetStateAction<Checkerboard>>;
    setUiCheckerboard: Dispatch<SetStateAction<Checkerboard>>;
    setTurn: Dispatch<SetStateAction<PieceSet>>;
    setIsCaptureTurn: Dispatch<SetStateAction<boolean>>;
    setWinner: Dispatch<SetStateAction<PieceSet | null>>;
    setSelectedSquare: Dispatch<SetStateAction<Square | null>>;
    setActiveSquare: Dispatch<SetStateAction<TakenSquare | null>>;
    setCurrentPaths: Dispatch<SetStateAction<MovePath[]>>;
    setMoveHistory: Dispatch<SetStateAction<MoveHistoryItem[]>>;
    setLightsRemaining: Dispatch<SetStateAction<number>>;
    setDarksRemaining: Dispatch<SetStateAction<number>>;
    setLightKingsCount: Dispatch<SetStateAction<number>>;
    setDarkKingsCount: Dispatch<SetStateAction<number>>;
  };
}
