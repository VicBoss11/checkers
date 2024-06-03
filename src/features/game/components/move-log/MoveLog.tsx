import { Fragment, ReactElement, useContext, useEffect } from 'react';
import { IconCaretRightFilled } from '@tabler/icons-react';
import { CheckersContext } from '@features/game/context/checkers-context';
import './MoveLog.scss';

enum MoveLogType {
  PossibleMoves,
  MoveHistory,
}

function MoveLog(): ReactElement {
  const { gameState } = useContext(CheckersContext);
  const { currentPaths } = gameState;

  const movesLog = [
    {
      type: MoveLogType.PossibleMoves,
      name: 'Movimientos posibles',
      className: 'move-log-possible-moves',
      paths: currentPaths,
    },
    // {
    //   type: MoveLogType.MoveHistory,
    //   name: 'Historial de movimientos',
    //   className: 'move-log-move-history',
    //   paths: currentPaths,
    // },
  ];

  useEffect(() => {
    const logDetailsElements = document.querySelectorAll<HTMLDetailsElement>(
      '.move-log .move-log-accordion'
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
          open={index === 0}
        >
          <summary className="move-log-label">{moveLog.name}</summary>

          <div className="move-log-content">
            {moveLog.paths.map((path, index) => (
              <div key={index} className="move-log-move">
                <span className="move-log-move-label">{index + 1}</span>

                <span className="move-log-move-value">
                  {path.map((move, moveIndex) => (
                    <Fragment key={moveIndex}>
                      <span>{move.square.location}</span>

                      {moveIndex < path.length - 1 && (
                        <IconCaretRightFilled size={14} stroke={2} />
                      )}
                    </Fragment>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </details>
      ))}
    </section>
  );
}

export default MoveLog;
