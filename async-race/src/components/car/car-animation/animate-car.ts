import { FINISH_OFFSET, SPEED_MULTIPLIER, WIDTH_DIVIDER, MILLISECONDS } from '@/data/constants';
import { carState } from '@state/car-state';
import { getCarStore, setCarAnimationId } from '@state/car-store';
import { setEngineButtons } from '@utils/set-car-buttons';

export function animateCar(
  carId: number,
  velocity: number,
  distance: number,
  onFinish?: (succeeded: boolean) => void,
): void {
  const car = carState.getById(carId);

  if (!car) {
    return;
  }

  car.isDriving = true;

  const carElement = getCarStore(carId);

  if (!carElement) {
    return;
  }

  const { svg: carSvg, track, trackLine, finish } = carElement;

  const carWidth = carSvg.getBoundingClientRect().width;

  const distancePx =
    finish.getBoundingClientRect().left -
    track.getBoundingClientRect().left +
    carWidth / WIDTH_DIVIDER +
    FINISH_OFFSET;

  if (distancePx <= 0) {
    return;
  }

  const animationTime = distance / velocity;
  const raceTime = animationTime / SPEED_MULTIPLIER;
  const startTime = performance.now();

  trackLine.classList.add('blink');

  function startAnimation(time: number): void {
    const passedTime = (time - startTime) / MILLISECONDS;
    const progress = Math.min(passedTime / raceTime, 1);

    carSvg.style.transform = `translateX(${distancePx * progress}px)`;

    if (passedTime / raceTime <= 1) {
      setCarAnimationId(carId, requestAnimationFrame(startAnimation));
    } else {
      stopCarAnimation(carId);
      if (onFinish) {
        onFinish(true);
      }
    }
  }

  setCarAnimationId(carId, requestAnimationFrame(startAnimation));
}

export function stopCarAnimation(carId: number): void {
  const car = carState.getById(carId);

  if (!car) {
    return;
  }

  const carElement = getCarStore(carId);

  if (carElement?.animationId !== undefined) {
    cancelAnimationFrame(carElement.animationId);
    carElement.animationId = undefined;
  }

  car.isDriving = false;

  if (carElement) {
    carElement.track.classList.remove('blink');
    setEngineButtons(carId, false, true);
  }
}
