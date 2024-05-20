import { useState } from 'react';
import { buildDefaultCheckerboard } from '../helpers/checkerboard.helper';
import {
  DEFAULT_SETTINGS,
  DEFAULT_RULES,
  DEFAULT_PLAYERS,
  DEFAULT_REMAINIG_LIGHT_PIECES,
} from '../helpers/constants';
import { Square, TakenSquare } from '../models/interfaces';
import { Settings, RuleSet } from '../models/interfaces/game-settings';
import { Checkerboard, MovePath } from '../models/types';
import { Player } from '../models/interfaces/game-state';
import { Set } from '../models/enums';
import { CheckersHook } from '../models/types/custom-hooks';

function useCheckers(): CheckersHook {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [rules, setRules] = useState<RuleSet>(DEFAULT_RULES);
  const [player1, setPlayer1] = useState<Player>(DEFAULT_PLAYERS[0]);
  const [player2, setPlayer2] = useState<Player>(DEFAULT_PLAYERS[1]);
  const [checkerboard, setCheckerboard] = useState<Checkerboard>(
    buildDefaultCheckerboard()
  );

  const [uiCheckerboard, setUiCheckerboard] =
    useState<Checkerboard>(checkerboard);

  const [turn, setTurn] = useState<Set>(Set.Light);
  const [isCaptureTurn, setIsCaptureTurn] = useState<boolean>(false);
  const [winner, setWinner] = useState<Set | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [activeSquare, setActiveSquare] = useState<TakenSquare | null>(null);

  const [currentPaths, setCurrentPaths] = useState<MovePath[]>([]);
  const [remainingLights, setRemainingLights] = useState<number>(
    DEFAULT_REMAINIG_LIGHT_PIECES
  );

  const [remainingDarks, setRemainingDarks] = useState<number>(
    DEFAULT_REMAINIG_LIGHT_PIECES
  );

  return {
    gameState: {
      settings,
      rules,
      player1,
      player2,
      checkerboard,
      uiCheckerboard,
      turn,
      isCaptureTurn,
      winner,
      selectedSquare,
      activeSquare,
      currentPaths,
      remainingLights,
      remainingDarks,
    },
    setFunctions: {
      setSettings,
      setRules,
      setPlayer1,
      setPlayer2,
      setCheckerboard,
      setUiCheckerboard,
      setTurn,
      setIsCaptureTurn,
      setWinner,
      setSelectedSquare,
      setActiveSquare,
      setCurrentPaths,
      setRemainingLights,
      setRemainingDarks,
    },
  };
}

export default useCheckers;
