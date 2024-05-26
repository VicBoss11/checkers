import { ReactNode, ReactElement, useContext } from 'react';
import { SQUARES_PER_SIDE } from '../../constants/checkers';
import { CheckersContext } from '../../context/checkers-context';
import { getGuideClassName } from '../../helpers/checkerboard-guides-helper';
import { GameMode } from '../../models/enums/game-state';
import './CheckerboardGuides.scss';

function CheckerboardGuides({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const { gameState } = useContext(CheckersContext);
  const { gameMode } = gameState.settings;

  const isLocalGameMode = gameMode === GameMode.Local;

  return (
    <div className="checkerboard-guides">
      {isLocalGameMode && <LettersGuide isReversed />}
      {isLocalGameMode && <NumbersGuide isVertical isReversed />}

      {children}

      <LettersGuide />
      <NumbersGuide isVertical />
    </div>
  );
}

function NumbersGuide({
  isVertical = false,
  isReversed = false,
}: {
  isVertical?: boolean;
  isReversed?: boolean;
}): ReactElement {
  const numbers = Array.from(
    { length: SQUARES_PER_SIDE },
    (_, i) => i + 1
  ).reverse();

  return (
    <div className={getGuideClassName(isVertical, isReversed)}>
      {numbers.map((number) => (
        <span key={number}>{number}</span>
      ))}
    </div>
  );
}

function LettersGuide({
  isVertical = false,
  isReversed = false,
}: {
  isVertical?: boolean;
  isReversed?: boolean;
}): ReactElement {
  const letters = Array.from({ length: SQUARES_PER_SIDE }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  return (
    <div className={getGuideClassName(isVertical, isReversed)}>
      {letters.map((letter, i) => (
        <span key={i + 1}>{letter}</span>
      ))}
    </div>
  );
}

export default CheckerboardGuides;
