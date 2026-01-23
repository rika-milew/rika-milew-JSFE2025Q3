import { stopCarAnimation } from '@/components/car/car-animation/stop-car-animation';
import { carState } from '@/state/car-state';
import { getCarStore } from '@/state/car-store';
import { updateRaceSound } from '@/utils/play-race-sound';
import { setEngineButtons } from '@/utils/set-car-buttons';
import { setGarageButtons, setRaceButton } from '@/utils/set-garage-buttons';

export function resetCarPosition(carId: number): void {
  const carElement = getCarStore(carId);
  const car = carState.getById(carId);

  if (!carElement || !car) {
    return;
  }

  if (carElement.animationId !== undefined) {
    cancelAnimationFrame(carElement.animationId);
    carElement.animationId = undefined;
  }

  car.currentPosition = 0;
  car.isDriving = false;

  setRaceButton();
  updateRaceSound();

  carElement.svg.style.transform = 'translateX(0)';
  carElement.track.classList.remove('blink');

  setEngineButtons(carId, true, false);
}

export function resetAllCarsPositions(): void {
  setGarageButtons(true, true, true);

  carState.isRacing = false;
  carState.winner = undefined;
  carState.garageSessionId += 1;

  carState.cars.forEach((car) => {
    stopCarAnimation(car.id);
    car.currentPosition = 0;
    car.isDriving = false;
    updateRaceSound();

    const carElement = getCarStore(car.id);

    if (carElement) {
      carElement.svg.style.transform = 'translateX(0)';
      carElement.track.classList.remove('blink');
      setEngineButtons(car.id, true, false);
    }

    setRaceButton();
  });
}
