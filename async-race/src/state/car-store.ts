import type { CarStore } from '@/types/types';

const carStore = new Map<number, CarStore>();

export function addCarStore(carId: number, ui: CarStore): void {
  carStore.set(carId, ui);
}

export function getCarStore(carId: number): CarStore | undefined {
  return carStore.get(carId);
}

export function removeCarStore(carId: number): void {
  carStore.delete(carId);
}

export function setCarAnimationId(carId: number, animationId?: number): void {
  const car = carStore.get(carId);

  if (!car) {
    return;
  }
  car.animationId = animationId;
}
