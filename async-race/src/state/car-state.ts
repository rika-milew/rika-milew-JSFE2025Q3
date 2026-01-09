import type { Car } from '../types/types';

type CarState = {
  cars: Car[];
  set(cars: Car[]): void;
  add(car: Car): void;
  update(updatedCar: Car): void;
  remove(id: number): void;
};

export const carState: CarState = {
  cars: [],

  set(cars: Car[]): void {
    this.cars = cars;
  },

  add(car: Car): void {
    this.cars.push(car);
  },

  update(updatedCar: Car): void {
    const index = this.cars.findIndex((car) => car.id === updatedCar.id);
    if (index !== -1) {
      this.cars[index] = updatedCar;
    }
  },

  remove(id: number): void {
    this.cars = this.cars.filter((car) => car.id !== id);
  },
};
