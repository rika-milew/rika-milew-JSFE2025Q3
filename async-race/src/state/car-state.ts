import { appState } from '@/state/app-state';

import type { Car, CarState, CarStateItem } from '@/types/types';

export const carState: CarState = {
  cars: [],
  totalCount: 0,
  winner: undefined,
  isRacing: false,
  garageSessionId: 0,

  set(cars: Car[], totalCount?: number): void {
    this.cars = cars.map((car) => ({
      ...car,
      currentPosition: 0,
      isDriving: false,
      trackDistance: 0,
    }));
    if (totalCount !== undefined) {
      this.totalCount = totalCount;
    }
  },

  add(car: Car): void {
    this.cars.push({
      ...car,
      currentPosition: 0,
      isDriving: false,
      trackDistance: 0,
    });
    this.totalCount += 1;
  },

  update(updatedCar: Car): void {
    const index: number = this.cars.findIndex((car) => car.id === updatedCar.id);
    if (index !== -1) {
      const saved: CarStateItem = this.cars[index];
      this.cars[index] = {
        ...updatedCar,
        currentPosition: saved.currentPosition,
        isDriving: saved.isDriving,
        trackDistance: saved.trackDistance,
      };
    }
  },

  remove(id: number): void {
    this.cars = this.cars.filter((car) => car.id !== id);
    this.totalCount -= 1;
  },

  getById(id: number): CarStateItem | undefined {
    return this.cars.find((c) => c.id === id);
  },

  getAllOnCurrentPage(): CarStateItem[] {
    const start: number = (appState.garagePage - 1) * appState.perPage;
    const end: number = start + appState.perPage;
    return this.cars.slice(start, end);
  },
};
