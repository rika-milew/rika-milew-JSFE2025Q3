import { carState } from '@/state/car-state';
import { getCarStore } from '@/state/car-store';
import { stopCarAnimation } from '@components/car/car-animation/animate-car';
import { setEngineButtons } from '@utils/set-car-buttons';

export function resetCar(carId: number): void {
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

  carElement.svg.style.transform = 'translateX(0)';

  carElement.track.classList.remove('blink');

  setEngineButtons(carId, true, false);
}

export function resetAllCars(): void {
  carState.cars.forEach((car) => {
    stopCarAnimation(car.id);
    car.currentPosition = 0;
    car.isDriving = false;

    const carElement = getCarStore(car.id);
    if (carElement) {
      carElement.svg.style.transform = 'translateX(0)';
      carElement.track.classList.remove('blink');
      setEngineButtons(car.id, true, false);
    }
  });
}

export function stopAllCarAnimations(): void {
  carState.cars.forEach((car) => {
    const element = getCarStore(car.id);
    if (element?.animationId !== undefined) {
      cancelAnimationFrame(element.animationId);
      element.animationId = undefined;
    }
  });
}
