import { stopCarAnimation } from '@/components/car/car-animation/stop-car-animation';
import {
  FINISH_OFFSET,
  SPEED_MULTIPLIER,
  WIDTH_DIVIDER,
  MILLISECONDS,
} from '@/constants/constants';
import { carState } from '@/state/car-state';
import { getCarStore, setCarAnimationId } from '@/state/car-store';
import { updateRaceSound } from '@/utils/play-race-sound';

import type { CarStateItem, CarStore } from '@/types/types';

export function animateCar(
  carId: number,
  velocity: number,
  distance: number,
  onFinish?: (succeeded: boolean, time?: number) => void,
): void {
  const car: CarStateItem | undefined = carState.getById(carId);

  if (!car) {
    return;
  }

  car.isDriving = true;
  updateRaceSound();

  const carElement: CarStore | undefined = getCarStore(carId);

  if (!carElement) {
    return;
  }

  const { svg: carSvg, track, trackLine, finish } = carElement;

  const carWidth: number = carSvg.getBoundingClientRect().width;

  const distancePx: number =
    finish.getBoundingClientRect().left -
    track.getBoundingClientRect().left +
    carWidth / WIDTH_DIVIDER +
    FINISH_OFFSET;

  if (distancePx <= 0) {
    return;
  }

  const animationTime: number = distance / velocity;
  const raceTime: number = animationTime / SPEED_MULTIPLIER;
  const startTime: number = performance.now();

  trackLine.classList.add('blink');

  function startAnimation(time: number): void {
    const passedTime: number = (time - startTime) / MILLISECONDS;
    const progress: number = Math.min(passedTime / raceTime, 1);

    carSvg.style.transform = `translateX(${distancePx * progress}px)`;

    if (passedTime / raceTime <= 1) {
      setCarAnimationId(carId, requestAnimationFrame(startAnimation));
    } else {
      stopCarAnimation(carId);
      if (onFinish) {
        onFinish(true, passedTime);
      }
    }
  }

  setCarAnimationId(carId, requestAnimationFrame(startAnimation));
}
