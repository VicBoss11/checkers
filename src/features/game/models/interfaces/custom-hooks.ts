export interface CheckersHook {
  className: string;
  showCheckerboardGuides: boolean;
}

export interface PlayableSquareHook {
  className: string;
  squareStates: {
    isSelected: boolean;
    isActive: boolean;
    isPossibleMove: boolean;
    isImmediateMove: boolean;
    isClickable: boolean;
  };
  makeMove: () => void;
  highlightPaths: () => void;
  updateUiCheckerboard: () => void;
}
