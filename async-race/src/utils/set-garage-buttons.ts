import { carState } from '@/state/car-state';

export const garageButtons: {
  race?: HTMLButtonElement;
  reset?: HTMLButtonElement;
  generate?: HTMLButtonElement;
} = {};

export function setGarageButtons(
  raceEnabled: boolean,
  resetEnabled: boolean,
  generateEnabled: boolean,
): void {
  if (garageButtons.race) {
    garageButtons.race.disabled = !raceEnabled;
  }

  if (garageButtons.reset) {
    garageButtons.reset.disabled = !resetEnabled;
  }

  if (garageButtons.generate) {
    garageButtons.generate.disabled = !generateEnabled;
  }
}

export function setRaceButton(): void {
  if (!garageButtons.race) {
    return;
  }

  const hasDrivingCars: boolean = carState.cars.some((car) => car.isDriving);

  garageButtons.race.disabled = hasDrivingCars;
}
