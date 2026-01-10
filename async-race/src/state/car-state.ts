import type { Car } from '../types/types';

type CarState = {
  cars: Car[];
  totalCount: number;
  set(cars: Car[], totalCount?: number): void;
  add(car: Car): void;
  update(updatedCar: Car): void;
  remove(id: number): void;
};

export const carState: CarState = {
  cars: [],
  totalCount: 0,

  set(cars: Car[], totalCount?: number): void {
    this.cars = cars;
    if (totalCount !== undefined) {
      this.totalCount = totalCount;
    }
  },

  add(car: Car): void {
    this.cars.push(car);
    this.totalCount += 1;
  },

  update(updatedCar: Car): void {
    const index = this.cars.findIndex((car) => car.id === updatedCar.id);
    if (index !== -1) {
      this.cars[index] = updatedCar;
    }
  },

  remove(id: number): void {
    this.cars = this.cars.filter((car) => car.id !== id);
    this.totalCount -= 1;
  },
};
