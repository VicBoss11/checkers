import { MutableRefObject } from 'react';

export interface CheckersHook {
  className: string;
  showCheckerboardGuides: boolean;
}

export interface PlayableSquareHook {
  squareRef: MutableRefObject<HTMLDivElement | null>;
  className: string;
  squareStates: {
    isActive: boolean;
    isPossibleMove: boolean;
    isImmediateMove: boolean;
    isClickable: boolean;
  };
  makeMove: () => void;
  highlightPaths: () => void;
  updateUiCheckerboard: () => void;
}
