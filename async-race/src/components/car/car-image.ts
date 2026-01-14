import { carSvg1, carSvg2, carSvg3 } from '@components/car/car.config';

import type { CarSvg } from '../../types/types';

export function createCarImage(initialColor: string): CarSvg {
  const svgType = 'http://www.w3.org/2000/svg';

  const svg = document.createElementNS(svgType, 'svg');
  svg.setAttribute('width', '90');
  svg.setAttribute('height', '33');
  svg.setAttribute('viewBox', '0 0 90 33');
  svg.setAttribute('fill', initialColor);

  const rightWheel = document.createElementNS(svgType, 'path');
  rightWheel.setAttribute('d', carSvg1);
  rightWheel.setAttribute('fill', initialColor);

  const leftWheel = document.createElementNS(svgType, 'path');
  leftWheel.setAttribute('d', carSvg2);
  leftWheel.setAttribute('fill', initialColor);

  const carBody = document.createElementNS(svgType, 'path');
  carBody.setAttribute('d', carSvg3);
  carBody.setAttribute('fill', initialColor);

  svg.append(rightWheel, leftWheel, carBody);

  return {
    element: svg,
    setColor: (color: string): void => {
      carBody.setAttribute('fill', color);
    },
  };
}

export function createFinishFlag(): HTMLImageElement {
  const img = document.createElement('img');
  img.src = '/finish.svg';
  img.alt = 'Finish';
  img.className = 'race__finish';

  return img;
}
