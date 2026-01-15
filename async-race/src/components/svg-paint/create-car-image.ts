import { carLeftWheel, carMain, carRightWheel } from '@/components/svg-paint/car-svg.config';

import type { CarSvg } from '../../types/types';

export function createCarImage(initialColor: string): CarSvg {
  const svgType = 'http://www.w3.org/2000/svg';

  const svg = document.createElementNS(svgType, 'svg');
  svg.setAttribute('width', '90');
  svg.setAttribute('height', '33');
  svg.setAttribute('viewBox', '0 0 90 33');
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
