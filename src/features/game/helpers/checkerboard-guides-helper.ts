import { getClassName } from './checkers-helper';

export const getGuideClassName = (
  isVertical: boolean,
  isReversed: boolean
): string => {
  const orientationClassName = isVertical
    ? 'vertical-guide'
    : 'horizontal-guide';

  const isReversedClassName = isReversed ? 'reversed-guide' : '';

  return getClassName(['guide', orientationClassName, isReversedClassName]);
};
