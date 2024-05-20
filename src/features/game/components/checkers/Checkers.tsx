import { ReactElement } from 'react';
import { CheckersProvider } from '../../context/checkers-context';
import Checkerboard from '../checkerboard/Checkerboard';
import './Checkers.scss';

function Checkers(): ReactElement {
  return (
    <CheckersProvider>
      <Checkerboard />
    </CheckersProvider>
  );
}

export default Checkers;
