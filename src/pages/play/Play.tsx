import { ReactElement } from 'react';
import { CheckersProvider } from '@features/game/context/checkers-context';
import TurnInfo from '@features/game/components/turn-info/TurnInfo';
import Checkers from '@features/game/components/checkers/Checkers';
import GameSatus from '@features/game/components/game-status/GameStatus';
import MoveLog from '@features/game/components/move-log/MoveLog';
import Layout from '@features/ui/components/layout/Layout';
import './Play.scss';

function Play(): ReactElement {
  return (
    <Layout>
      <CheckersProvider>
        <section className="play">
          <section className="game">
            <aside className="turn-info-container">
              <TurnInfo></TurnInfo>
            </aside>

            <aside className="game-info">
              <GameSatus></GameSatus>
              <MoveLog></MoveLog>
            </aside>

            <section className="checkers-container">
              <Checkers></Checkers>
            </section>
          </section>
        </section>
      </CheckersProvider>
    </Layout>
  );
}

export default Play;
