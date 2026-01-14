import { getCarStore, setCarAnimationId } from '@/state/car-store';
import { audioPLayer } from '@utils/audio-player';
import { setEngineButtons } from '@utils/set-car-buttons';

export function animateCar(carId: number, velocity: number, distance: number): void {
  const FINISH_OFFSET = 5;
  const SPEED_MULTIPLIER = 350;
  const WIDTH_DIVIDER = 2;
  const MILLISECONDS = 1000;

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

  audioPLayer.playSound('race');
  trackLine.classList.add('blink');

  function startAnimation(time: number): void {
    const passedTime = (time - startTime) / MILLISECONDS;
    const progress = Math.min(passedTime / raceTime, 1);

    carSvg.style.transform = `translateX(${distancePx * progress}px)`;

    if (passedTime / raceTime <= 1) {
      setCarAnimationId(carId, requestAnimationFrame(startAnimation));
    } else {
      stopCarAnimation(carId);
    }
  }

  setCarAnimationId(carId, requestAnimationFrame(startAnimation));
}

export function stopCarAnimation(carId: number): void {
  const carElement = getCarStore(carId);

  if (!carElement) {
    return;
  }

  if (carElement.animationId !== undefined) {
    cancelAnimationFrame(carElement.animationId);
    setCarAnimationId(carId, undefined);
  }

  audioPLayer.stopSound('race');
  audioPLayer.playSound('brake');
  carElement.track.classList.remove('blink');

  setEngineButtons(carId, false, true);
}
