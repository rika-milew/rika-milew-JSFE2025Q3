import { carLeftWheel, carMain, carRightWheel } from '@/components/svg-paint/car-svg.config';
import { GARAGE_CAR_WIDTH, GARAGE_CAR_HEIGHT } from '@/constants/constants';

import type { CarSvg } from '@/types/types';

export function createCarImage(
  initialColor: string,
  width = GARAGE_CAR_WIDTH,
  height = GARAGE_CAR_HEIGHT,
): CarSvg {
  const svg: SVGSVGElement = createSvgElement('svg');
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  svg.setAttribute('viewBox', '0 0 90 33');
  svg.setAttribute('fill', initialColor);

  const rightWheel: SVGPathElement = createSvgElement('path');
  rightWheel.setAttribute('d', carRightWheel);
  rightWheel.setAttribute('fill', initialColor);

  const leftWheel: SVGPathElement = createSvgElement('path');
  leftWheel.setAttribute('d', carMain);
  leftWheel.setAttribute('fill', initialColor);

  const carBody: SVGPathElement = createSvgElement('path');
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

function createSvgElement<K extends keyof SVGElementTagNameMap>(
  tagName: K,
): SVGElementTagNameMap[K] {
  return document.createElementNS('http://www.w3.org/2000/svg', tagName);
}
