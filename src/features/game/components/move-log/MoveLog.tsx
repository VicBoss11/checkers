import { Fragment, ReactElement, useContext, useEffect } from 'react';
import {
  IconArrowNarrowRight,
  IconCaptureFilled,
  IconCaretRightFilled,
} from '@tabler/icons-react';
import { CheckersContext } from '@features/game/context/checkers-context';
import { MovePath } from '@features/game/models/types/checkers';
import { MoveHistoryItem } from '@features/game/models/interfaces/checkers';
import { isLightSet } from '@features/game/helpers/checkers-helper';
import './MoveLog.scss';

enum MoveLogType {
  PossibleMoves,
  MoveHistory,
}

function MoveLog(): ReactElement {
  const { gameState } = useContext(CheckersContext);
  const { currentPaths, moveHistory } = gameState;

  const movesLog = [
    {
      type: MoveLogType.PossibleMoves,
      name: 'Movimientos posibles',
      className: 'move-log-possible-moves',
      paths: currentPaths,
    },
    {
      type: MoveLogType.MoveHistory,
      name: 'Historial de movimientos',
      className: 'move-log-move-history',
      paths: moveHistory,
    },
  ];

  useEffect(() => {
    const moveLogAccordionSelector = '.move-log .move-log-accordion';

    const logDetailsElements = document.querySelectorAll<HTMLDetailsElement>(
      moveLogAccordionSelector
    );

    const handleToggle = (e: Event) => {
      if ((e.currentTarget as HTMLDetailsElement).open) {
        logDetailsElements.forEach((element) => {
          if (element !== e.currentTarget) {
            element.open = false;
          }
        });
      }
    };

    logDetailsElements.forEach((element) => {
      element.addEventListener('toggle', handleToggle);
    });

    // When the component unmounts, remove the event listeners
    return () => {
      logDetailsElements.forEach((element) => {
        element.removeEventListener('toggle', handleToggle);
      });
    };
  }, []);

  return (
    <section className="move-log">
      {movesLog.map((moveLog, index) => (
        <details
          key={index}
          className={`move-log-accordion ${moveLog.className}`}
          open={moveLog.type === MoveLogType.MoveHistory}
        >
          <summary className="move-log-label">{moveLog.name}</summary>

          <section className="move-log-content">
            {moveLog.type === MoveLogType.PossibleMoves
              ? (moveLog.paths as MovePath[]).map((path, index) => (
                  <PossibleMovesLog
                    key={index}
                    path={path}
                    number={index + 1}
                  />
                ))
              : (moveLog.paths as MoveHistoryItem[]).map((path, index) => (
                  <MoveHistoryLog
                    key={index}
                    path={path}
                    number={moveLog.paths.length - index}
                  />
                ))}
          </section>
        </details>
      ))}
    </section>
  );
}

function PossibleMovesLog({
  path,
  number,
}: {
  path: MovePath;
  number: number;
}): ReactElement {
  return (
    <div className="move-log-move">
      <span className="move-log-move-label">{number}</span>

      <span className="move-log-move-value possible-move-item">
        {path.map((move, index) => (
          <Fragment key={index}>
            <span>{move.square.location}</span>

            {index < path.length - 1 && (
              <IconCaretRightFilled size={14} stroke={2} />
            )}
          </Fragment>
        ))}
      </span>
    </div>
  );
}

function MoveHistoryLog({
  path,
  number,
}: {
  path: MoveHistoryItem;
  number: number;
}): ReactElement {
  const { turn, fromSquare, toSquare, capturedSquare, isCaptureMove } = path;

  const isLightTurn = isLightSet(turn);
  const turnClassName = isLightTurn ? 'turn-light' : 'turn-dark';

  return (
    <div className="move-log-move">
      <span className="move-log-move-label">{number}</span>

      <div
        className={`move-log-move-value move-history-log-item ${turnClassName}`}
      >
        <div className="move-history-log-move">
          <span>{fromSquare.location}</span>

          <IconCaretRightFilled size={14} stroke={2} />

          <span>{toSquare.location}</span>
        </div>

        {isCaptureMove && (
          <div className="move-history-log-captured-piece">
            <IconArrowNarrowRight size={18} stroke={2} />

            <span>Come {capturedSquare!.location}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MoveLog;
