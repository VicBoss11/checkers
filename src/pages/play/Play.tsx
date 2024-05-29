import { ReactElement } from 'react';
import { CheckersProvider } from '@features/game/context/checkers-context';
import TurnInfo from '@features/game/components/turn-info/TurnInfo';
import Checkers from '@features/game/components/checkers/Checkers';
import GameSatus from '@features/game/components/game-status/GameStatus';
import Layout from '@features/ui/components/layout/Layout';
import './Play.scss';

function Play(): ReactElement {
  return (
    <Layout>
      <CheckersProvider>
        <section className="play">
          <section className="game-container">
            <TurnInfo></TurnInfo>

            <GameSatus></GameSatus>

            <Checkers></Checkers>
          </section>
        </section>
      </CheckersProvider>
    </Layout>
  );
}

export default Play;
