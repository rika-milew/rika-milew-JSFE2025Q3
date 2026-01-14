import { getCarStore, setCarAnimationId } from '@/state/car-store';
import { audioPLayer } from '@utils/audio-player';

export function animateCar(carId: number, velocity: number, distance: number): void {
  const FINISH_OFFSET = 5;
  const SPEED_MULTIPLIER = 350;
  const WIDTH_DIVIDER = 2;
  const MILLISECONDS = 1000;

  const carObject = getCarStore(carId);

  if (!carObject) {
    return;
  }

  const { svg: carSvg, track, trackLine, finish } = carObject;

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
      setCarAnimationId(carId, undefined);
      audioPLayer.stopSound('race');
      trackLine.classList.remove('blink');
    }
  }

  setCarAnimationId(carId, requestAnimationFrame(startAnimation));
}
