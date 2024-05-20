import { ReactElement } from 'react';
import { getClassName } from '../../helpers/checkers-helper';
import { PieceSet } from '../../models/enums/checkers';
import { Piece as IPiece } from '../../models/interfaces/checkers';
import './Piece.scss';

function Piece({ piece }: { piece: IPiece }): ReactElement {
  const color = piece.set === PieceSet.Light ? 'light' : 'dark';

  const colorClassName = `piece-${color}`;
  const isKingClassName = piece.isKing ? 'piece--is-king' : '';

  const className = getClassName(['piece', colorClassName, isKingClassName]);

  return <span className={className} />;
}

export default Piece;
