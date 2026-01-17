import { carLeftWheel, carMain, carRightWheel } from '@/components/svg-paint/car-svg.config';
import { GARAGE_CAR_WIDTH, GARAGE_CAR_HEIGHT } from '@/data/constants';

import type { CarSvg } from '../../types/types';

export function createCarImage(
  initialColor: string,
  width = GARAGE_CAR_WIDTH,
  height = GARAGE_CAR_HEIGHT,
): CarSvg {
  const svgType = 'http://www.w3.org/2000/svg';

  const svg = document.createElementNS(svgType, 'svg');
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  svg.setAttribute('viewBox', '0 0 width height');
  svg.setAttribute('fill', initialColor);

  const rightWheel = document.createElementNS(svgType, 'path');
  rightWheel.setAttribute('d', carRightWheel);
  rightWheel.setAttribute('fill', initialColor);

  const leftWheel = document.createElementNS(svgType, 'path');
  leftWheel.setAttribute('d', carMain);
  leftWheel.setAttribute('fill', initialColor);

  const carBody = document.createElementNS(svgType, 'path');
  carBody.setAttribute('d', carLeftWheel);
  carBody.setAttribute('fill', initialColor);

  svg.append(rightWheel, leftWheel, carBody);

  return {
    element: svg,
    setColor: (color: string): void => {
      carBody.setAttribute('fill', color);
    },
  };
}
