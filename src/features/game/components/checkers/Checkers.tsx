import { ReactElement } from 'react';
import useCheckers from '../../hooks/use-checkers';
import CheckerboardGuides from '../checkerboard-guides/CheckerboardGuides';
import Checkerboard from '../checkerboard/Checkerboard';
import './Checkers.scss';

function Checkers(): ReactElement {
  const { className, showCheckerboardGuides } = useCheckers();

  return (
    <div className={className}>
      <div className="checkerboard-shadow">
        <div className="checkerboard-container">
          {showCheckerboardGuides ? (
            <CheckerboardWithGuides />
          ) : (
            <CheckerboardWithoutGuides />
          )}
        </div>
      </div>
    </div>
  );
}

function CheckerboardWithGuides(): ReactElement {
  return (
    <CheckerboardGuides>
      <Checkerboard />
    </CheckerboardGuides>
  );
}

function CheckerboardWithoutGuides(): ReactElement {
  return <Checkerboard />;
}

export default Checkers;
